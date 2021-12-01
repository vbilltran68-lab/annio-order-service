import { DATABASE_TYPE } from '@annio/core/lib/interfaces';
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
        transport: Transport.TCP,
        options: {
          host: process.env.SERVICE_PAYMENT_HOST,
          port: +process.env.SERVICE_PAYMENT_PORT,
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
