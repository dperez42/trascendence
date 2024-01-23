import { Module } from '@nestjs/common';

import { UploadController } from './upload.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}