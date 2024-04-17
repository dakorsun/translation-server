import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfModule } from './typeorm/typeorm.module';

@Module({
  imports: [TypeOrmConfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
