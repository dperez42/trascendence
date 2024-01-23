// Importaciones de varios módulos y servicios de NestJS, Socket.IO, y los módulos personalizados que has creado.
import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayInit, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateMessageWDto, Params } from './dto/create-message-w.dto';
import { JwtPayload } from '../auth/interfaces';
import { ChatMessageWsService, MessageWsService, SocketManagerService } from './services';
import { SocketEventsService } from 'src/services/socket-events.service';

interface Contacts {
	id: string;
	login: string;
	name: string;
	images: string;
	blocked: boolean;
}

// Decorador para crear un gateway WebSocket con el namespace 'message-ws'.
// ws://localhost:3000/message-ws
@WebSocketGateway({
	cors: true,
	namespace: 'message-ws',
})
// La clase implementa varias interfaces para manejar eventos del WebSocket.
export class MessageWsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
	// Creación de un nuevo Logger y varias dependencias inyectadas en el constructor.
	private readonly logger = new Logger(MessageWsGateway.name);
	constructor(
		private readonly messageWsService: MessageWsService,
		private readonly chatMessageWsService: ChatMessageWsService,
		private readonly jwtService: JwtService,
		private readonly socketManagerService: SocketManagerService,
		// private readonly authService: AuthService,
		private readonly socketEventsService: SocketEventsService,
	) {}

	// Una referencia al servidor WebSocket.
	@WebSocketServer()
	wss: Server;

	// private clients = new Map<string, string[]>();

	// Método que se ejecuta después de la inicialización del gateway.
	afterInit() {
		this.logger.log("Websocket Gateway initialized");
	}

	// Método que se ejecuta cuando un cliente se conecta.
	async handleConnection(client: Socket) {
	}

	async handleReConnection(client: Socket) {
		console.log('reconnect');
	}
	// Método que se ejecuta cuando un cliente se desconecta.
	async handleDisconnect(client: Socket) {
		try {
			const IdUUID = this.socketManagerService.getUserIdBySocketId(client.id);
			const contacts: Contacts[] = await this.messageWsService.getContactById(IdUUID);
			this.socketManagerService.unregisterClient(client);

			if ((this.socketManagerService.getClients(IdUUID)).length > 0)
				return ;
			this.myContactOnline(contacts).then(transformedContactsOnline => {
				transformedContactsOnline.forEach(contact => {
					const contactSockets = this.socketManagerService.getClients(contact.id);
					contactSockets.forEach(socketId => {
						this.wss.to(socketId).emit('disconnect-contact-server', IdUUID);
					});
				});
			});
			const user_on_line = await this.myUsersOnline(contacts);
			await this.wss.emit('users-online-server', user_on_line);
		} catch (error) {
			console.error("Error handling disconnect:", error);
		}
	}

	// regitra los ids logueados a un map
	@SubscribeMessage('client-register')
	async handleRegisterId(client: Socket, data: any): Promise<any>  {
		this.wss.emit('connect-total', client.id);
		// Extraer el token JWT del encabezado del mensaje de conexión.
		let payload: JwtPayload;
		  // Intenta verificar el token y registra al cliente en el servicio de mensajes.
		try{
			payload = this.jwtService.verify(data.token);
			this.socketManagerService.registerClient(payload.id, client.id);

			// Obtiene la lista de contactos del usuario de la base de datos.
			const contacts: Contacts[] = await this.messageWsService.getContactById(payload.id);
			//me retorna mis contactos online
			await this.contacstEmit(client, payload.id, contacts);
			
			const user_on_line = await this.myUsersOnline(contacts)
			await this.wss.emit('users-online-server', user_on_line);
		} catch(error) {
			client.emit('message-error', { response: error.response });
			client.disconnect(true);
			return;
		}
	}

	@SubscribeMessage('contact-online')
	async handleTestEvent(client: Socket, data: any): Promise<any> {
		try {
			const contactOnline = await this.myContactOnline(data.message);
			return { success: true, message: contactOnline };
		} catch (error) {
			return { success: false, message: 'Hubo un error al procesar la solicitud' };
		}
	}

	//socket
	async contacstEmit(client: Socket, IdUUID: string, contacts: Contacts[]) {
		const idUser = this.socketManagerService.getUserIdBySocketId(client.id);

		// Crea un nuevo arreglo transformando los datos de los contactos.
		const transformedContactsOnline = await this.myContactOnline(contacts)
		if (!transformedContactsOnline) {
			throw new Error("Error transformando contactos");
		}
		
		// Obtiene los sockets abiertos por cada cliente.
		const idSockets = this.socketManagerService.getClients(IdUUID);
		
		// const user_on_line = await this.myUsersOnline(contacts)
		// await this.wss.emit('users-online-server', user_on_line);

		// se emite a si mismo.
		idSockets.forEach(idSocket => {
			this.wss.to(idSocket).emit('my-contact-server', transformedContactsOnline);
		});

		if (idSockets.length === 1){
			contacts.forEach(async (contact) => {
				const contactSockets = this.socketManagerService.getClients(contact.id);
				contactSockets.forEach(socketId => {
					this.wss.to(socketId).emit('connect-contact-server', idUser);
				});
			});
		}
	}

	async usersEmit(contacts: Contacts[]) {
		const user_on_line = await this.myUsersOnline(contacts)
		this.wss.emit('users-online-server', user_on_line);
	}

	//
	async myContactOnline(contacts: Contacts[]): Promise<Contacts[]> {
		const contactOnline = contacts.map(contactItem => {
			if (this.socketManagerService.getClients(contactItem.id).length > 0) {
				const { images, blocked, ...rest } = contactItem; 
				return {
					...rest,
					images: null, 
					blocked: null
				};
			}
			return null;
		}).filter(item => item !== null);		
		return contactOnline;
	}

	async myUsersOnline(users: any[]): Promise<any[]> {
		/*
		const usersOnline = users.map(userItem => {
			if (this.socketManagerService.getClients(userItem.id).length > 0) {
				const { images, blocked, ...rest } = userItem; 
				return {
					...rest,
					images: null, 
					blocked: null
				};
			}
			return null;
		}).filter(item => item !== null);		
		
		return usersOnline;
		*/
		return this.socketManagerService.getAllClients()
	}




	// indica que tiene que actualizar su lista de contactos

	async notifyContactsOfOnlineStatus(userId: string) {
		// Obtiene la lista de contactos del usuario que acaba de conectarse.
		const userContacts: Contacts[] = await this.messageWsService.getContactById(userId);
	
		// Para cada contacto del usuario, emitir un mensaje notificando que el usuario está en línea.
		userContacts.forEach(async (contact) => {
			const contactSockets = this.socketManagerService.getClients(contact.id);
			contactSockets.forEach(socketId => {
				this.wss.to(socketId).emit('status-contact-server', { userId, status: 'online' });
			});
		});
	}

	// Otro método para manejar diferentes tipos de mensajes de los clientes.
	@SubscribeMessage('client-message')
	async handleMessage(client: Socket, payload: CreateMessageWDto) {
		try {
			const params = payload.params;
			// Dependiendo del comando en el payload, ejecuta diferentes funciones.
			switch (params.command) {
				case 'JOIN':
					await this.handleJoin(client, params);
					break;
				case 'PART':
					await this.handlePart(client, params);
					break;
				case 'PRIVMSG':
					await this.handlePrivmsg(client, params);
					break;
				case 'KICK':
					await this.handleKick(client, params);
					break;
				default:
					throw new NotFoundException(`Unsupported command: ${params.command}`);
			}
		} catch (error) {
			client.emit('message-error', { response: error.response });
		}
	}

	// Maneja cuando un cliente quiere unirse a un chat.
	async handleJoin(client: Socket, params: any) {
		try {
			
			const idUser = this.socketManagerService.getUserIdBySocketId(client.id);
			const channel = await this.chatMessageWsService.getUserChanelRegister(client, params, idUser);
			
	  
			client.emit('message-server',{
				response: channel
			  });
		} catch (error) {
			// Emitir un mensaje de error al cliente.
			client.emit('message-error', { response: error.response });
			
		}
	}

	async handlePart(client: Socket, params: any) {
		// Aquí se añadiría el código para manejar este caso.
	}

	async handlePrivmsg(client: Socket, params: Params) {
		try {
			const idUser = this.socketManagerService.getUserIdBySocketId(client.id);
			if (params.type === 'room') {
				const silenceUserInChannel = await this.messageWsService.getContactInChannel(params.target, params.id);
				if(silenceUserInChannel.silence === true)
					return;
				const userOnlineChat = await this.messageWsService.getActiveChatUsers(params.target)
				userOnlineChat.forEach(user => {
					
					user.clientIds.forEach(clientId => {
						const messageData = {
							id:			idUser,
							user:		params.user,
							message:	params.message,
							target:		params.target,
							type:		params.type,
							name:		params.name,
							command:	params.command,
						};
						if (clientId != client.id) {
							this.wss.to(clientId).emit('message-server', messageData);
							this.emitMessageAndNotification(client, true, clientId, 'message-server', messageData);
						}
					});
				});
			}
			else {
				const idSockets = this.socketManagerService.getClients(params.target);
				const userDB = await this.messageWsService.getUserFullData(idUser);
				// is bloqued
				const isBlocked = await this.messageWsService.getContactBlockedById(params.target, userDB.id);
				if (isBlocked) {
					return;
				}
				idSockets.forEach(idSocket => {
					const messageData = {
						id: params.target,
						user: userDB.login,
						message: params.message,
						target: userDB.id,
						type: params.type,
					};
					// Comprueba si el ID del socket del cliente es diferente del ID del socket del remitente.
					if (idSocket != client.id) {
						this.wss.to(idSocket).emit('message-server', messageData);
						this.emitMessageAndNotification(client, true, idSocket, 'message-server', messageData);
					}
				});
			}
		} catch (error) {
			client.emit('message-error', { response: error.response });
		}
	}

	private emitMessageAndNotification(client: Socket, sendValue: boolean, clientId: string, messageType: string, messageData: any) {
		if (sendValue)
			this.socketEventsService.emitNotificationPrivate(client, clientId,  { type: 'chat-message', data: messageData});
	}

	// private emitContact
	// notificaciones

	async handleKick(client: Socket, params: any) {
		// Aquí se añadiría el código para manejar este caso.
	}

	
}
