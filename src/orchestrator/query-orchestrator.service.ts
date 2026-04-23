import { Injectable } from '@nestjs/common';
import { IntentClassifierService } from '../Classifier/intent.classifier.service';
import { SqlService } from '../sql/sql.service';
import { RagService } from '../rag/rag.service';
import { ResponseGeneratorService } from '../response/response.generator.service';

@Injectable()
export class QueryOrchestratorService {
  constructor(
    private classifier: IntentClassifierService,
    private sql: SqlService,
    private rag: RagService,
    private responseGen: ResponseGeneratorService,
  ) {}

  async handle(query: string) {
    // 1. classify intent
    const type = await this.classifier.classify(query);
    console.log('\n🔵 ORCHESTRATOR START');
    console.log('Query:', query);

    // 2. route
    let data: any;

    if (type === 'SQL') {
      data = await this.sql.execute(query);
    } else {
      data = await this.rag.ask(query);
    }

    // 3. final response generation
    return this.responseGen.generate(query, type, data);
  }
}