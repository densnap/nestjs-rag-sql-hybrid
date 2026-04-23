import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for the web interface
  app.enableCors({
    origin: true, // Allow all origins for development
    credentials: true,
  });

  // Serve static files (CSS, JS, images)
  app.useStaticAssets(join(process.cwd()));

  await app.listen(4000);
  console.log(`🚀 Server running on http://localhost:4000`);
}
bootstrap();