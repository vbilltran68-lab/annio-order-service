import {
  Module,
  DynamicModule,
  Logger,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '@annio/core/modules';
import { BodyParserMiddleware } from '@annio/core/middlewares';
import { OrderController } from './controllers';
import { IAppConfig } from './interfaces';
import { OrderEntity } from './entities';
import { OrderService, PaymentService } from './services';
import { ClientProxyFactory } from '@nestjs/microservices';

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
      providers: [
        OrderService,
        PaymentService,
        {
          provide: config.services.payment.key,
          useFactory: () =>
            ClientProxyFactory.create(config.services.payment.config),
        },
      ],
      exports: [OrderService, PaymentService],
    };
  }

  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BodyParserMiddleware).forRoutes('*');
  }
}
