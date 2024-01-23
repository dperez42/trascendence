import { Module } from '@nestjs/common';

import { MessageWsService } from './services/message-ws.service';
import { MessageWsGateway } from './message-ws.gateway';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { ContactModule } from '../contact/contact.module';
import { UserModule } from '../user/user.module';
import { ChatUserModule } from 'src/chat-user/chat-user.module';

import { AuthService } from 'src/auth/auth.service';
import { ChatMessageWsService, SocketManagerService } from './services';
import { SocketEventsService } from 'src/services/socket-events.service';

@Module({
  providers: [
    MessageWsGateway,
    MessageWsService,
    AuthService,
    SocketManagerService,
    ChatMessageWsService,
    SocketEventsService
  ],
  imports: [ AuthModule, ChatModule, ChatUserModule, UserModule, ContactModule ],
  exports: [ SocketManagerService, MessageWsService]
})

export class MessageWsModule {}
