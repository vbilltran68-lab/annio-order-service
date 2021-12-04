import { DATABASE_TYPE } from '@annio/core/interfaces';
import { MICROSERVICE } from '@app/constants';
import { IAppConfig } from '@app/interfaces';
import { Transport } from '@nestjs/microservices';
import { readFileSync } from 'fs';
import * as path from 'path';

export const AppConfig: IAppConfig = {
  project: {
    package: loadRootJson('package.json'),
  },
  env: {
    name: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? +process.env.PORT : 5000,
    protocol: process.env.PROTOCOL === 'https' ? 'https' : 'http',
    microserviceOptions: {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.SERVICE_ORDER_RMQ_URL],
        queue: process.env.SERVICE_ORDER_RMQ_QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    },
  },
  database: {
    type: DATABASE_TYPE.MYSQL,
    env: {
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      databaseName: process.env.DB_NAME,
    },
    entities: [__dirname + './../entities/*.entity{.ts,.js}'],
    migrations: [__dirname + './../migrations/*.ts'],
    options: {
      connectionLimit: 10,
    },
  },
  services: {
    payment: {
      key: MICROSERVICE.PAYMENT,
      config: {
        transport: Transport.RMQ,
        options: {
          urls: [process.env.SERVICE_PAYMENT_RMQ_URL],
          queue: process.env.SERVICE_PAYMENT_RMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    },
    delivery: {
      secondDelay: +process.env.DELIVERY_SECOND_DELAY || 15,
    },
  },
};

export function getRootPath() {
  return __dirname + './../../../';
}

export function resolveRootFile(fileName: string) {
  return path.resolve(__dirname, getRootPath(), fileName);
}

export function loadRootJson<T = any>(fileName: string) {
  return JSON.parse(readFileSync(resolveRootFile(fileName)).toString()) as T;
}
