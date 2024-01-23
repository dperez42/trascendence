import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './entities/user.entity';




@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
  ],
  exports: [UserService],
})
export class UserModule {}
