import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { AppConfig } from './app/config/app-config';
import { Transport } from '@nestjs/common/enums/transport.enum';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AppModule.forRoot(AppConfig),
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: AppConfig.env.port,
      },
    },
  );

  await app.listenAsync();
}
bootstrap();
