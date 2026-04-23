import { Controller, Get, Query } from '@nestjs/common';
import { QueryOrchestratorService } from '../orchestrator/query-orchestrator.service';

@Controller('chat')
export class QueryController {
  constructor(private orchestrator: QueryOrchestratorService) {}

  @Get()
  async chat(@Query('q') q: string) {
    return this.orchestrator.handle(q);
  }
}