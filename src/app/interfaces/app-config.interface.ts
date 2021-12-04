import { IDatabaseConfig, IMicroServiceConfig } from '@annio/core/interfaces';
import { MicroserviceOptions } from '@nestjs/common/interfaces/microservices/microservice-configuration.interface';
import { NestMicroserviceOptions } from '@nestjs/common/interfaces/microservices/nest-microservice-options.interface';

export interface IAppConfig {
  project: {
    package: any;
  };
  env: {
    name: string;
    port: number;
    protocol: 'http' | 'https';
    microserviceOptions: NestMicroserviceOptions & MicroserviceOptions;
  };
  database: IDatabaseConfig;
  services: {
    payment: IMicroServiceConfig;
    delivery: {
      secondDelay: number;
    };
  };
}
