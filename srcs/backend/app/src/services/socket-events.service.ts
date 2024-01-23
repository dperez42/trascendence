import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketEventsService {
  emitNotificationPrivate(sender: Socket, clientId: string, data: any) {
    sender.to(clientId).emit('notification', data);
  }
}
