import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DriveService } from 'src/drive/drive.service';
import { CronJob } from './entities/cron-job.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChronosService {
  private readonly logger = new Logger(ChronosService.name);

  constructor(
    private readonly driveService: DriveService,
    @InjectRepository(CronJob)
    private readonly cronJobRepository: Repository<CronJob>,
  ) {}

  @Cron('30 * * * * *')
  async checkDriveExistingFiles() {
    this.logger.log('--------------------');
    this.logger.log('cron');
    try {
      const files = await this.driveService.listFiles();
      if (files.length > 0) {
        this.logger.log('All files: ' + JSON.stringify(files, null, 2));
      } else {
        this.logger.log('No new files found.');
      }
    } catch (error) {
      this.logger.error('The API returned an error: ' + error);
    }
    this.logger.log('--------------------');
  }
}
