import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfModule } from './typeorm/typeorm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { ChronosModule } from './chronos/chronos.module';
import { DriveModule } from './drive/drive.module';

@Module({
  imports: [
    TypeOrmConfModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    ChronosModule,
    DriveModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
