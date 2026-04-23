import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueryOrchestratorService } from './orchestrator/query-orchestrator.service';
import * as readline from 'readline';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const orchestrator = app.get(QueryOrchestratorService);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n🤖 AI CLI is running...');
  console.log('Type your query below (type "exit" to quit)\n');

  const ask = () => {
    rl.question('> ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        await app.close();
        rl.close();
        return;
      }

      try {
       // console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        //console.log('⏳ Processing request...');
        //console.log('📝 Input:', input);

        const start = Date.now();

        const result = await orchestrator.handle(input);

        const duration = Date.now() - start;

        console.log('\n🧠 RESPONSE');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(result);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
       // console.log(`⏱️ Time taken: ${duration}ms`);
        //console.log('\n');

      } catch (err: any) {
      //  console.log('\n❌ ERROR DETAILS');
        //console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        console.log('Message:', err?.message);

        if (err?.response?.data) {
         // console.log('\n📡 API RESPONSE:');
          //console.log(JSON.stringify(err.response.data, null, 2));
        }

        if (err?.stack) {
         // console.log('\n🧵 Stack trace:');
         // console.log(err.stack);
        }

        //console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }

      ask();
    });
  };

  ask();
}

bootstrap();