import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  // type: 'postgres',
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // port: 5432,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DB,
  // synchronize: true,
  // entities: ["dist/**/*.entity{.ts,.js}"],
  // url: process.env.DATABASE_URL,
  // ssl: true

  // localhost
  host: 'localhost',
  password: 'postgres',
  database: 'igEnterprise',
  port: 5432,
  type: 'postgres',
  username: 'postgres',
  synchronize: false,
  entities: ["dist/**/*.entity{.ts,.js}"],
  logging: true,
  extra: {
    socketPath: '/cloudsql/ig-ian:asia-southeast1:igapp'
  },

  // production
  // host: '/cloudsql/ig-ian:asia-southeast1:igapp',
  // password: 'Lj9nCufrlbsJnNpJ',
  // database: 'igapp',
  // type: 'postgres',
  // username: 'postgres',
  // synchronize: false,
  // entities: ["dist/**/*.entity{.ts,.js}"],
  // logging: true,
  // extra: {
  //   socketPath: '/cloudsql/ig-ian:asia-southeast1:igapp' // change this value
  // },
};