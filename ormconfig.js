const { DATABASE_TYPE } = require('@annio/core/interfaces');

module.exports = [
  {
    name: 'default',
    type: DATABASE_TYPE.MYSQL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    dropSchema: false,
    logging: true,
    entities: ['src/app/entities/*.entity{.ts,.js}'],
    migrations: ['src/app/migrations/*.ts'],
    cli: {
      migrationsDir: 'src/app/migrations',
    },
  },
];
