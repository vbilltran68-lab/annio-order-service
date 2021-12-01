import {
  IDatabaseConfig,
  IMicroServiceConfig,
} from '@annio/core/lib/interfaces';

export interface IAppConfig {
  project: {
    package: any;
  };
  env: {
    name: string;
    port: number;
    protocol: 'http' | 'https';
  };
  database: IDatabaseConfig;
  services: {
    payment: IMicroServiceConfig;
    delivery: {
      secondDelay: number;
    };
  };
}
