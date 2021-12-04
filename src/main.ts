import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfig } from './app/config/app-config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule.forRoot(AppConfig),
    AppConfig.env.microserviceOptions,
  );

  await app.listenAsync();
}
bootstrap();
