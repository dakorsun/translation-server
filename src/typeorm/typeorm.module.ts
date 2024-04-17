import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeormConfig } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ...typeormConfig(config),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class TypeOrmConfModule {}
