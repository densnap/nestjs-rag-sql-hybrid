import { Injectable } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class ResponseGeneratorService {
  constructor(private llm: LlmService) {}

  async generate(query: string, type: string, data: any) {
    const prompt = `
You are a business assistant.

User Query: ${query}
Type: ${type}

Data:
${JSON.stringify(data, null, 2)}

Generate a clear, human-readable response.
Do NOT mention internal systems or JSON.
`;

    return this.llm.chat(prompt);
  }
}