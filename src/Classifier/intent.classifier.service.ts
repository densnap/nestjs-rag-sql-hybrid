import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';

export type IntentType = 'SQL' | 'RAG';

@Injectable()
export class IntentClassifierService {
  constructor(private llm: LlmService) {}

  async classify(query: string): Promise<IntentType> {
    const prompt = `
You are a query classifier.

Return ONLY JSON:
{ "type": "SQL" | "RAG" }

Rules:
- SQL → structured data (shops, orders, inventory)
- RAG → explanations, documents, policies, knowledge

Query: ${query}
`;

    const res = await this.llm.chat(prompt);

    try {
      return JSON.parse(res).type;
    } catch {
      return 'RAG';
    }
  }
}