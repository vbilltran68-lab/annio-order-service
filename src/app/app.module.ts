import {
  Module,
  DynamicModule,
  Logger,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '@annio/core/lib/modules';
import { BodyParserMiddleware } from '@annio/core/lib/middlewares';
import { OrderController } from './controllers';
import { IAppConfig } from './interfaces';
import { OrderEntity } from './entities';
import { OrderService } from './services';

@Module({})
export class AppModule implements NestModule {
  static forRoot(config: IAppConfig): DynamicModule {
    return {
      module: AppModule,
      imports: [
        TypeOrmConfigModule.forRoot(config.database, new Logger('DB')),
        TypeOrmModule.forFeature([OrderEntity]),
      ],
      controllers: [OrderController],
      providers: [OrderService],
      exports: [OrderService],
    };
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BodyParserMiddleware).forRoutes('*');
  }
}
