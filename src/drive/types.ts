import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ServiceAccountCredentials {
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

export class FileMeta {
  @Expose()
  id: string;
  @Expose()
  name: string;
}
