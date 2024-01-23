import { Module } from '@nestjs/common';
import { GameWsService } from './game-ws.service';
import { GameWsGateway } from './game-ws.gateway';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { GamesModule } from '../games/games.module'
import { GamesUserModule } from '../games _user/gamesuser.module'
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../contact/entities/contact.entity';
import { User } from 'src/user/entities/user.entity';
import { ExceptionService } from 'src/services/exception.service';
import { SocketManagerService } from '../message-ws/services';

//import { MessageWsService } from '../message-ws/services/message-ws.service';
//import { MessageWsModule } from '../message-ws/message-ws.module'

@Module({
  providers: [
    GameWsGateway, 
    GameWsService, 
    AuthService, 
    ExceptionService,
    SocketManagerService,
    //MessageWsService
  ],
  imports: [ 
    TypeOrmModule.forFeature([Contact, User]),
    AuthModule, 
    GamesModule, 
    GamesUserModule,
    //MessageWsModule
  ],
})
export class GameWsModule {}
