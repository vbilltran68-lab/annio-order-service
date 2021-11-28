import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { AppModule } from './app/app.module';
import { AppConfig } from './app/config/app-config';

async function bootstrap() {
  /** config app  */
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.forRoot(AppConfig),
    {
      cors: true,
      bodyParser: false,
    },
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    exceptionFactory: ((error) => {
      Logger.error("Validate error");
      Logger.error(error);
      return new BadRequestException(error);
    }),
  }));

  /** configure swagger */
  const options = new DocumentBuilder()
    .setTitle(AppConfig.project.package.name)
    .setDescription(AppConfig.project.package.description)
    .setContact(
      AppConfig.project.package.author.name,
      "",
      AppConfig.project.package.author.email,
    )
    .setLicense(AppConfig.project.package.license, '')
    .setVersion(AppConfig.project.package.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/', app, document);

  /** start app */
  await app.listen(AppConfig.env.port);
}
bootstrap();
