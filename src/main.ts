import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { AppConfig } from './app/config/app-config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(AppConfig),
    {
      cors: true,
      bodyParser: false,
    },
  );
  await app.connectMicroservice(AppConfig.env.microserviceOptions);
  await app.startAllMicroservicesAsync();
  /** start app */
  await app.listen(AppConfig.env.port);
}
bootstrap();
