import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  private chatUrl = process.env.CHAT_URL!;
  private embedUrl = process.env.EMBED_URL!;

  private headers() {
    return {
      'x-service-line': process.env.X_SERVICE_LINE!,
      'x-brand': process.env.X_BRAND!,
      'x-project': process.env.X_PROJECT!,
      'api-version': process.env.API_VERSION!,
      'Content-Type': process.env.CONTENT_TYPE!,
      'Ocp-Apim-Subscription-Key': process.env.CHAT_API_KEY!,
    };
  }

  // 🧠 CHAT COMPLETION
  async chat(prompt: string) {
    // console.log('\n🤖 CHAT DEBUG');
    // console.log('URL:', this.chatUrl);
    // console.log('API VERSION:', process.env.API_VERSION);

    const payload = {
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));

    const res = await fetch(this.chatUrl, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();

      console.log('\n❌ CHAT API FAILED');
      console.log('Status:', res.status);
      console.log('Response:', err);

      throw new Error(`Chat API Error: ${err}`);
    }

    const data = await res.json();

    console.log('\n📦 CHAT RAW RESPONSE');
    console.log(JSON.stringify(data, null, 2));

    return (
      data?.choices?.[0]?.message?.content ||
      data?.output ||
      ''
    );
  }

  // 📦 EMBEDDINGS
  async embed(text: string): Promise<number[]> {
    console.log('\n📦 EMBEDDING DEBUG');
    console.log('URL:', this.embedUrl);

    const res = await fetch(this.embedUrl, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        input: text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();

      console.log('\n❌ EMBEDDING FAILED');
      console.log('Status:', res.status);
      console.log('Response:', err);

      throw new Error(`Embedding API Error: ${err}`);
    }

    const data = await res.json();

    console.log('\n📦 EMBEDDING RAW RESPONSE');
    console.log(JSON.stringify(data, null, 2));

    return data?.data?.[0]?.embedding || [];
  }
}