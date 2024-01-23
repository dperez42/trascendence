import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError, Equal, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';

import { CreateChatUserDto } from './dto/create-chat-user.dto';

import { User } from '../user/entities/user.entity';
import { Chat } from '../chat/entities';
import { ChatUser } from './entities/chat-user.entity';
import { ExceptionService } from '../services/exception.service';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { UpdateChatUserDto } from './dto/update-chat-user.dto';
import { CustomHttpException } from 'src/chat/exceptions/custom-http-exception';

@Injectable()
export class ChatUserService {

	private readonly logger = new Logger('ChatService');
	
	constructor(
	@InjectRepository(Chat)
	private chatRepository: Repository<Chat>,
		
	@InjectRepository(ChatUser)
	private chatUsersRepository: Repository<ChatUser>,

	private readonly exceptionService: ExceptionService,


	) {}

	async create(createChatUserDto: CreateChatUserDto, user: User) {
		try {
			const { chatId, ...chatUserDetails } = createChatUserDto;
			
			if (!isUUID(chatId))
			throw new NotFoundException(`Chat with id ${chatId} not founds`);
		
			const chat = await this.chatRepository.findOneBy({ id: chatId });
		
			if (!chat) 
				throw new NotFoundException(`Chat with id ${chatId} not found`);
		
			// Buscar un registro existente con el mismo chatId y userId
			const existingChatUser = await this.chatUsersRepository.findOneBy({ chat: { id: chatId }, user: { id: user.id } });
		
			if (existingChatUser) {
				return {
					message: "Canal existente",
					status: false,
					channel: existingChatUser
				};
			}

			const chatUser = this.chatUsersRepository.create(chatUserDetails);
			chatUser.chat = chat;
			chatUser.user = user;
		
			await this.chatUsersRepository.save(chatUser);

			// retorna el chatUser creado con el usuario y el chat
			return {
				message: "Canal nuevo",
				status: true,
				channel: chatUser
			};

		} catch (error) {
			// si el error es de tipo EntityNotFoundError, lanzar un error 404
			if (error instanceof EntityNotFoundError) {
				this.exceptionService.handleNotFoundException('Chat not found', `Chat with id not found.`);
			} else {
				// si no, lanzar un error
				this.exceptionService.handleDBExceptions(error);
			}
		}
	}

	//plain chatUsers call controller
	// async findOnePlain( term: string )
	// {
	// 	const { ...rest } = await this.findOne( term );
	// 	return {
	// 		...rest
	// 	}
	// }

	async findOneChatUserByIdentifier(identifier: string)
	{
		
		if (isUUID(identifier)) {


			
			const chatUsers = await this.chatUsersRepository
			.createQueryBuilder('chatUser')
			.select('chatUser.chat.id', 'chatId') 
			.addSelect('chatUser.user.id', 'userId') 
			.innerJoin('chatUser.chat', 'chat')
			.innerJoin('chatUser.user', 'user')
			.where('chat.id = :chatId', { chatId: identifier })
			.getRawMany();
			
			
			if (!chatUsers) {
				throw new NotFoundException(`Chat with id	${ identifier } not found`);
			}
			const chatUsersArray = Object.values(chatUsers);
			return {
				...chatUsersArray
			};
		}
		return null;
	}

	async findOneChatUserByIdentifierDetail(identifier: string): Promise<any[]> {
		if (isUUID(identifier)) {
			const chatUsers: ChatUser[] = await this.chatUsersRepository.find({
			where: {
				chat: { id: identifier }
			},
			select: ['chat', 'user']
			});
			
			if (chatUsers.length === 0) {
			throw new NotFoundException(`Chat with id ${identifier} not found`);
			}
		
			const chatUserDAta = chatUsers.map(chatUser => ({
			id: chatUser.id,
			rol: chatUser.rol,
			silence: chatUser.silence,
			created_at: chatUser.created_at,
			user: {
				id: chatUser.user.id,
				name: chatUser.user.name,
				login: chatUser.user.login,
				roles: chatUser.user.roles,
				images: chatUser.user.images
			}
			}));
			const chatUsersArray = Object.values(chatUserDAta);
			return {
				...chatUsersArray
			};
		}
		return [];
	  }

	async findAllChatsByUserId(identifier: string)
	{
		if (isUUID(identifier)) {
			const chatUsers = await this.chatUsersRepository
			.createQueryBuilder('chatUser')
			.select('chat.id', 'chatId')
			.addSelect('chat.name', 'chatName')
			.addSelect('user.id', 'userId')
			.addSelect(`
				CASE 
					WHEN chat.password IS NOT NULL AND chat.password <> '' 
					THEN '*****' 
					ELSE NULL 
				END`, 'password')
			.innerJoin('chatUser.chat', 'chat')
			.innerJoin('chatUser.user', 'user')
			.where('user.id = :userId', { userId: identifier })
			.getRawMany();

			
			
			if (!chatUsers || chatUsers.length === 0) {
				return [];
			}
			const chatUsersArray = Object.values(chatUsers);
			return {
				...chatUsersArray
			};
		}
		return null;
	}

	async updateUserProperty(userId: string, updateChatUserDto: UpdateChatUserDto, user: User) {
		try {
			const { chatId, ...chatUserDetails } = updateChatUserDto;
			
			if (!isUUID(userId))
				throw new NotFoundException(`Chat with id ${userId} not founds`);
	
			if (!isUUID(chatId))
				throw new NotFoundException(`Chat with id ${chatId} not founds`);
		
			const chatUser: UpdateChatUserDto = await this.chatUsersRepository.findOneBy(
				{
					chat: { id: chatId },
					user: { id: user.id }
				}
			);
		
			if (!chatUser) 
				throw new CustomHttpException('', false, `Chat with id ${chatId} not found`, HttpStatus.BAD_REQUEST);
		
			if (chatUser.rol != 'admin' && chatUser.rol != 'moderator')
				throw new CustomHttpException('', false, `The user ${user.name} is not admin or moderator`, HttpStatus.BAD_REQUEST);
	
			const updateData = new UpdateChatUserDto();
			Object.assign(updateData, chatUserDetails);
	
			const chatUserUpdated = await this.chatUsersRepository.update(
				{
					chat: { id: chatId },
					user: { id: userId }
				}, 
				updateData
			);
	
			if (!chatUserUpdated)
				throw new NotFoundException(`Chat with id ${userId} not found`);
	
			return {
				message: `User properties updated for user ${userId}`,
				status: true,
				channel: chatUserUpdated
			};
	
		} catch (error) {
			if (error instanceof CustomHttpException) {
				throw error;
			} else {
				throw new CustomHttpException('', false, `Error updating properties: ` + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	async findAllUsersInChat(idChat: string, idUser: string)
	{
		try {
			if (!isUUID(idChat) && !isUUID(idUser))
				throw new NotFoundException(`Chat with id ${idChat} or id user with id ${idUser} not founds`);
			const userInChat = await this.chatUsersRepository.findOneBy(
				{
					chat: { id: idChat },
					user: { id: idUser }
				}
			);
			if (!userInChat) 
				throw new CustomHttpException('', false, `Chat with id ${idChat} not found`, HttpStatus.BAD_REQUEST);
			cleanSensitiveUserData(userInChat.user);
			return userInChat;
		} catch (error) {
			if (error instanceof CustomHttpException) {
				throw error;
			} else {
				throw new CustomHttpException('', false, 'Error silence: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	async deleteUser(idUser: string, idChat: string, user: User)
	{
		try {
			if (!isUUID(idChat) && !isUUID(idUser))
				throw new NotFoundException(`Chat with id ${idChat} or id user with id ${idUser} not founds`);

			const userInChat = await this.chatUsersRepository.findOneBy(
				{
					chat: { id: idChat },
					user: { id: user.id }
				}
			);
			if (!userInChat) 
				throw new CustomHttpException('', false, `Chat with id ${idChat} not found`, HttpStatus.BAD_REQUEST);

			const userInChatDelete = await this.chatUsersRepository.findOneBy(
				{
					chat: { id: idChat },
					user: { id: idUser }
				}
			);
			if (!userInChatDelete) 
				throw new CustomHttpException('', false, `Chat with id ${idChat} not found`, HttpStatus.BAD_REQUEST);

			if (userInChat.rol === 'user') {
				if (userInChatDelete.rol === 'admin' || userInChatDelete.rol === 'moderator') {
					throw new CustomHttpException('', false, `A 'user' cannot remove an '${userInChatDelete.rol}'`, HttpStatus.BAD_REQUEST);
				}
			}
			
			else if (userInChat.rol === 'moderator') {
				if (userInChatDelete.rol === 'admin') {
					throw new CustomHttpException('', false, `A 'moderator' cannot remove an 'admin'`, HttpStatus.BAD_REQUEST);
				}
			}

			await this.chatUsersRepository.delete(userInChatDelete.id);
			return {
				message: `User ${idUser} deleted from chat ${idChat}`,
				status: true,
				channel: userInChatDelete
			};
		} catch (error) {
			if (error instanceof CustomHttpException) {
				throw error;
			} else {
				throw new CustomHttpException('', false, 'Error silence: ' + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}
}

function cleanSensitiveUserData(user: any) {
	delete user.password;
	delete user.isActive;
	delete user.twoFASecret;
	delete user.images;
	delete user.roles;
	delete user.first_time;
	delete user.email;
}
