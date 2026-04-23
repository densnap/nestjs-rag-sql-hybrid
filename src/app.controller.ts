import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as path from 'path';

@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response) {
    // Serve the HTML file
    res.sendFile(path.join(process.cwd(), 'index.html'));
  }

  @Get('api')
  getApiInfo() {
    return {
      message: 'Hybrid RAG + SQL Assistant API',
      version: '1.0.0',
      endpoints: {
        chat: 'GET /chat?q=your_query',
        docs: 'See README.md for full documentation'
      },
      status: 'running'
    };
  }
}