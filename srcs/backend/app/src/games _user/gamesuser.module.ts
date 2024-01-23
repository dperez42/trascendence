import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GamesUserService } from './gamesuser.service';
import { GamesUserController } from './gamesuser.controller';
import { AuthModule } from 'src/auth/auth.module';
import { GamesUser } from './entities/gamesuser.entity';
import { ExceptionService } from '../services/exception.service';


@Module({
  controllers: [GamesUserController],
  providers: [
    GamesUserService,
    ExceptionService,
  ],
  imports: [
    TypeOrmModule.forFeature([GamesUser]),
    AuthModule,
    ExceptionService,
  ],
  exports: [GamesUserService],
})
export class GamesUserModule {}
