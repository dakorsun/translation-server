import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Expose, plainToClass } from 'class-transformer';
import { IsNotEmpty, validateSync } from 'class-validator';
import { drive_v3, google } from 'googleapis';
import { base64toJson } from 'src/utils/string';

class ServiceAccountCredentials {
  @Expose()
  @IsNotEmpty()
  type: string;
  @Expose()
  @IsNotEmpty()
  private_key: string;
  @Expose()
  @IsNotEmpty()
  private_key_id: string;
  @Expose()
  @IsNotEmpty()
  client_email: string;
  @Expose()
  @IsNotEmpty()
  client_id: string;
  @Expose()
  @IsNotEmpty()
  auth_uri: string;
  @Expose()
  @IsNotEmpty()
  token_uri: string;
  @Expose()
  @IsNotEmpty()
  auth_provider_x509_cert_url: string;
  @Expose()
  @IsNotEmpty()
  client_x509_cert_url: string;
  @Expose()
  @IsNotEmpty()
  universe_domain: string;
}

@Injectable()
export class DriveService implements OnModuleInit {
  private readonly logger = new Logger(DriveService.name);
  private drive: drive_v3.Drive;

  // Interim hardcoded
  private folderId: string;
  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.setupDriveClient();
  }

  private setupDriveClient() {
    this.folderId = this.configService.get<string>('DRIVE_FOLDER_ID');
    if (!this.folderId) {
      throw new Error('DRIVE_FOLDER_ID is not provided');
    } else {
      this.logger.log('DRIVE_FOLDER_ID provided');
    }

    const serviceAccKeyBase64 = this.configService.get<string>(
      'SERVICE_ACCOUNT_KEY_BASE_64',
    );
    if (!serviceAccKeyBase64) {
      throw new Error('SERVICE_ACCOUNT_KEY_BASE_64 not provided');
    } else {
      this.logger.log('SERVICE_ACCOUNT_KEY_BASE_64 provided');
    }

    const serviceAccountJson = base64toJson(serviceAccKeyBase64);

    const credentials = plainToClass(
      ServiceAccountCredentials,
      serviceAccountJson,
      { excludeExtraneousValues: true },
    );

    const credentialsErrors = validateSync(credentials);

    if (credentialsErrors.length > 0) {
      throw new Error(
        'SERVICE_ACCOUNT_KEY_BASE_64 string contains invalid values',
      );
    } else {
      this.logger.log('Service account credentials are good');
    }

    const auth = new google.auth.GoogleAuth({
      credentials,
      // keyFile: 'src/drive/service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    this.logger.log('Configuration succeeded');
  }

  // TODO: make separate service for jobs
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkNewFiles() {
    this.logger.log('--------------------');
    this.logger.log('cron');
    try {
      const response = await this.drive.files.list({
        q: `'${this.folderId}' in parents and trashed = false`,
        orderBy: 'createdTime desc',
        fields: 'files(id, name)',
      });
      const files = response.data.files;
      if (files.length > 0) {
        this.logger.log('New files: ' + JSON.stringify(files, null, 2));
      } else {
        this.logger.log('No new files found.');
      }
    } catch (error) {
      this.logger.error('The API returned an error: ' + error);
    }
    this.logger.log('--------------------');
  }
}
