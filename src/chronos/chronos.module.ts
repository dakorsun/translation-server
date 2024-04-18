import { Module, forwardRef } from '@nestjs/common';
import { ChronosService } from './chronos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriveModule } from 'src/drive/drive.module';
import { CronJob } from './entities/cron-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CronJob]), forwardRef(() => DriveModule)],
  providers: [ChronosService],
  exports: [ChronosService],
})
export class ChronosModule {}
