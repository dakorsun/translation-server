import { BaseEntity } from 'src/utils/types/typeorm';
import { Column, Entity } from 'typeorm';

export enum CronJobTypes {
  ALL_FILES_CHECK = 'ALL_FILES_CHECK',
  NEW_FILES_CHECK = 'NEW_FILES_CHECK',
}

@Entity('cron-job')
export class CronJob extends BaseEntity {
  @Column({ type: 'enum', enum: CronJobTypes })
  name: CronJobTypes;
  @Column({ type: 'timestamp' })
  lastExecution: Date;
}
