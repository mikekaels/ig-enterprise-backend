import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // port: 5432,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DB,
  // synchronize: true,
  entities: ["dist/**/*.entity{.ts,.js}"],
  url: process.env.DATABASE_URL,
  ssl: true
};