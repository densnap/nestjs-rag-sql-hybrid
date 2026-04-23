import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SupabaseService } from '../common/supabase/supabase.service';

@Injectable()
export class RagService {
  private chatUrl = process.env.CHAT_URL!;

  // 🔥 HARD CODED (as requested working Postman style)
  private embedUrl =
    'https://ai-api-dev.dentsu.com/openai/deployments/TextEmbeddingAda2/embeddings?api-version=2025-04-01-preview';

  private apiKey = process.env.CHAT_API_KEY!;

  constructor(private supabaseService: SupabaseService) {}

  // =========================
  // 🔐 EXACT APIM HEADERS (DO NOT CHANGE)
  // =========================
  private getHeaders() {
    return {
      'x-service-line': process.env.X_SERVICE_LINE,
      'x-brand': process.env.X_BRAND,
      'x-project': process.env.X_PROJECT,
      'api-version': 'v15',
      'Ocp-Apim-Subscription-Key': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  // =========================
  // 🔵 EMBEDDINGS (FIXED)
  // =========================
  async embed(text: string): Promise<number[]> {
    const res = await axios.post(
      this.embedUrl,
      { input: text },
      { headers: this.getHeaders() },
    );

    if (!res.data?.data?.[0]?.embedding) {
      throw new Error('Embedding failed: invalid response from APIM');
    }

    return res.data.data[0].embedding;
  }

  // =========================
  // 🔎 VECTOR SEARCH (NO RPC)
  // =========================
  async retrieveTopChunks(query: string, limit = 5) {
    const supabase = this.supabaseService.getClient();

    const queryEmbedding = await this.embed(query);

    const { data, error } = await supabase
      .from('documents')
      .select('id, content, metadata, embedding');

    if (error) throw error;

    const scored = data.map((row) => ({
      ...row,
      score: this.cosineSimilarity(queryEmbedding, row.embedding),
    }));

    return scored.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  // =========================
  // 📐 COSINE SIMILARITY
  // =========================
  private cosineSimilarity(a: number[], b: number[]) {
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] ** 2;
      magB += b[i] ** 2;
    }

    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }

  // =========================
  // 🧠 CONTEXT BUILDER
  // =========================
  private buildContext(chunks: any[]) {
    return chunks.map((c) => c.content).join('\n\n');
  }

  // =========================
  // 💬 CHAT (UNCHANGED)
  // =========================
  async chat(prompt: string): Promise<string> {
    const res = await axios.post(
      this.chatUrl,
      {
        messages: [
          {
            role: 'system',
            content:
              'You are a precise enterprise assistant. Use only provided context.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      },
      { headers: this.getHeaders() },
    );

    return res.data.choices[0].message.content;
  }

  // =========================
  // 🚀 MAIN RAG PIPELINE
  // =========================
  async ask(query: string): Promise<string> {
    const chunks = await this.retrieveTopChunks(query);

    const context = this.buildContext(chunks);

    const finalPrompt = `
Context:
${context}

Question:
${query}

Answer strictly using the context above.
`;

    return this.chat(finalPrompt);
  }
}