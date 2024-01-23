import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatUserController } from './chat-user.controller';
import { ChatUser } from './entities/chat-user.entity';
import { Chat } from '../chat/entities';
import { ChatUserService } from './chat-user.service';
import { ExceptionService } from '../services/exception.service';

@Module({
  controllers: [ChatUserController],
  providers: [ChatUserService, ExceptionService],
  imports: [
    TypeOrmModule.forFeature([Chat, ChatUser]),
    //muy importante para usar el auth() en el controller
    AuthModule,
  ],
  exports: [ChatUserService],
})
export class ChatUserModule {}