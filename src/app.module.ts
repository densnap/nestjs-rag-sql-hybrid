import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ShopsModule } from './modules/shops/shops.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SupabaseModule } from './common/supabase/supabase.module';

// AI LAYER
import { QueryController } from './controller/query.controller';
import { QueryOrchestratorService } from './orchestrator/query-orchestrator.service';

import { IntentClassifierService } from './Classifier/intent.classifier.service';
import { SqlService } from './sql/sql.service';
import { RagService } from './rag/rag.service';
import { ResponseGeneratorService } from './response/response.generator.service';
import { LlmService } from './llm/llm.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ShopsModule,
    OrdersModule,
    SupabaseModule,
  ],

  controllers: [
    QueryController, // 👈 AI endpoint added globally
  ],

  providers: [
    // AI CORE
    QueryOrchestratorService,
    IntentClassifierService,
    SqlService,
    RagService,
    ResponseGeneratorService,
    LlmService,
  ],
})
export class AppModule {}