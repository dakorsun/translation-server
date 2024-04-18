import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { drive_v3, google } from 'googleapis';
import { base64toJson } from 'src/utils/string';
import { FileMeta, ServiceAccountCredentials } from './types';

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
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
    this.logger.log('Configuration succeeded');
  }

  async listFiles(): Promise<FileMeta[]> {
    const result = await this.drive.files.list({
      q: `'${this.folderId}' in parents and trashed = false`,
      orderBy: 'createdTime desc',
      fields: 'files(id, name)',
    });
    if (result.data.files.length === 0) {
      return [];
    }
    return result.data.files.map((data) =>
      plainToClass(FileMeta, data, { excludeExtraneousValues: true }),
    );
  }
}
