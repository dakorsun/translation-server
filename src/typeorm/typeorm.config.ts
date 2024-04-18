import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const typeormConfig = (
  configService: ConfigService = new ConfigService(),
): PostgresConnectionOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  entities: [join(__dirname, '..') + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsTableName: 'migrations',
  // todo do not use in production synchronize: true,
  synchronize: true,
});

export default new DataSource(typeormConfig());
