import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ExceptionService } from 'src/services/exception.service';
import { SocketManagerService } from '../message-ws/services/socketManager-ws.service';


import { User } from 'src/user/entities/user.entity';

import { AuthModule } from 'src/auth/auth.module';
import { Contact } from './entities/contact.entity';
import { ContactUserBlock } from './entities/contactUserBlock.entity';

@Module({
  controllers: [ContactController],
  providers: [
    ContactService, 
    ExceptionService, 
    SocketManagerService
  ],
  imports: [
    TypeOrmModule.forFeature([Contact, ContactUserBlock, User]),
    //muy importante para usar el auth() en el controller
    AuthModule,
  ],
  exports: [ContactService],
})
export class ContactModule {}
