import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, raw } from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/webhook/github', raw({ type: '*/*', limit: '2mb' }));
  app.use(json({ limit: '2mb' }));
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
