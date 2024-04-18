import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfModule } from './typeorm/typeorm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DriveService } from './drive/drive.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmConfModule,
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, DriveService],
})
export class AppModule {}
