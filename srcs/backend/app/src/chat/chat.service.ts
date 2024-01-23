import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateChatUserDto } from '../chat-user/dto/create-chat-user.dto';
import { ChatUserService } from '../chat-user/chat-user.service';

import { Chat } from './entities';
import { User } from '../user/entities/user.entity';
import { ChatUser } from '../chat-user/entities/chat-user.entity';
import { CustomHttpException } from './exceptions/custom-http-exception';



@Injectable()
export class ChatService {

	private readonly logger = new Logger('ChatService');

	constructor(
	@InjectRepository(Chat)
	private chatRepository: Repository<Chat>,

	@InjectRepository(ChatUser)
	private chatUsersRepository: Repository<ChatUser>,

	private readonly chatUserService: ChatUserService,

	private readonly: DataSource

	) {}

//TODO: add pagination
	async findAll( PaginationDto: PaginationDto)
	{
	const { limit, offset } = PaginationDto;
	const chat = await this.chatRepository.find({
		take: limit,
		skip: offset,
		relations: {
		chatUser: true,
		},
	});
	// aplano las imagenes
	return chat.map( ({ chatUser, ...res}) => ({
		...res,

	}))
	}

	//plain chatUsers call controller
	async findOnePlain( term: string )
	{
		const { ...rest } = await this.findOne( term );
		return {
			...rest
		}
	}

	async findOne(identifier: string)
	{
		let chat: Chat;
			
		if (isUUID(identifier)) {
			chat = await this.chatRepository.findOneBy( { id: identifier } );
		} else {
			chat = await this.chatRepository
			.createQueryBuilder('chat')
			.leftJoinAndSelect('chat.chatUser', 'chatUser')
			.leftJoinAndSelect('chatUser.user', 'user')
			.leftJoinAndSelect('chat.user', 'chatOwner')
			.orderBy('chatUser.id', 'ASC')
			.where('UPPER(chat.name) = :name OR chat.slug = :slug', {
				name: identifier.toUpperCase(),
				slug: identifier.toLowerCase(),
			})
			.getOne();
		}	 

		if (!chat) {
			throw new NotFoundException(`Chat with id	${ identifier } not found`);
		}
		return chat;
	}

	async create(createChatDto: CreateChatDto, user: User) {
		const permisosUser = user.roles.some(role => role === 'super-user' || role === 'admin');

		try {
			const { ...chatDetails } = createChatDto;
		
			// Verificar si el chat ya existe
			let existingChat = await this.chatRepository.findOne({ where: { name: chatDetails.name } });
			
			const chatUser = new CreateChatUserDto();

			
			if (!existingChat === true && createChatDto.isIncognito === true){	
				throw new CustomHttpException('', false, `Chat ${createChatDto.name} does not exist and cannot be joined in incognito mode`, HttpStatus.BAD_REQUEST);

			}
			if (existingChat) {
				if (permisosUser && createChatDto.isIncognito) {
					chatUser.chatId = existingChat.id;
				} else if (existingChat.password === createChatDto.password) { 
					// Si el chat no tiene contraseña o la contraseña proporcionada coincide
					chatUser.chatId = existingChat.id;
				} else {
					throw new CustomHttpException('', false, `Chat ${existingChat.name} has a password that does not match`, HttpStatus.BAD_REQUEST);
				}
			}
			
			 else {
				// Crear una nueva instancia de Chat y asignarle los valores de chatDetails y user
				const chat = new Chat();
				Object.assign(chat, chatDetails);
				chat.user = user;

				// Guardar la instancia de Chat en la base de datos
				const chatBD : Chat = await this.chatRepository.save(chat);
				chatUser.chatId = chatBD.id;
				chatUser.rol =  'admin';
				existingChat = chatBD;
			}
			if (permisosUser && createChatDto.isIncognito) {
				chatUser.rol = 'invisible';
			}
			const chatUserBD = await this.chatUserService.create(chatUser, user);
			return { chat: existingChat, register: chatUserBD.status};

		} catch (error) {
			if (error instanceof CustomHttpException) {
				throw error;
			} else {
				throw new CustomHttpException('', false, `Error updating properties: ` + error.message, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}
	}

	async update(id: string, updateChatDto: UpdateChatDto, user: User)
	{
		if (!isUUID(id))
      		throw new NotFoundException(`The id	${ id } is no UUID`);
		try {
			const foundChannel = await this.chatRepository.findOne({ where: { id: id } });
			if (!foundChannel)
				throw new NotFoundException(`Channel with ID ${id} no found`);

			const chatUser: any = await this.chatUsersRepository.findOne({
				where: {
					chat: { id: id },
					user: { id: user.id }
				}
			});
		
			if( chatUser && chatUser.rol === "user"){
				throw new HttpException('You do not have access to change channel privileges', HttpStatus.FORBIDDEN);
			}

			Object.assign(foundChannel, updateChatDto);
			const channelModificate: any = await this.chatRepository.save(foundChannel);
			
			cleanSensitiveUserData(channelModificate.user);
			channelModificate.chatUser.forEach(chatUser => cleanSensitiveUserData(chatUser.user));			
			return channelModificate;

		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			if (error.code === '23505') {
				throw new ConflictException('El recurso ya existe o está duplicado.');
			  }
			  throw new InternalServerErrorException(); 
		}
	}

	async remove(id: string, user: User): Promise<void> {
		try {
			if (user.roles.some(role => role === 'super-user' || role === 'admin')) {
				const result = await this.chatRepository.delete(id);
				if (result.affected === 0) {
					throw new NotFoundException(`Chat with ID "${id}" not found`);
				}
				return;
			}
	
			const Chat = await this.chatRepository.findOne({ where: { id: id }, relations: ["chatUser"] });
			if (!Chat) {
				throw new NotFoundException(`Chat with ID "${id}" not found`);
			}
	
			const requestingUser = Chat.chatUser.find(chatUser => chatUser.user.id === user.id);
			if (!requestingUser) {
				throw new NotFoundException('No eres parte de este chat.');
			}
	
			if (requestingUser.rol !== 'admin') {
				throw new NotFoundException('No eres admin de este chat.');
			}
	
			await this.chatRepository.delete(id);
	
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			throw new InternalServerErrorException(); 
		}
	}

	async chatOut(id: string, user: User) {
		if (!isUUID(id))
			throw new NotFoundException(`The id ${id} is no UUID`);
		
		const Chat = await this.chatRepository.findOneBy({ id });
		if (!Chat) {
			throw new NotFoundException(`Chat with id ${id} not found`);
		}
	
		// Encuentra al usuario solicitante en el chat
		const requestingUser = Chat.chatUser.find(chatUser => chatUser.user.id === user.id);
		if (!requestingUser) {
			throw new NotFoundException('No eres parte de este chat.');
		}
	
		// Si el usuario solicitante es admin
		if (requestingUser.rol === 'admin') {
			// Verificar si hay otros usuarios en el grupo
			const otherUsers = Chat.chatUser.filter(chatUser => chatUser.user.id !== user.id);
			if (otherUsers.length === 0) {
				await this.chatRepository.remove(Chat);
				return;
			}
	
			// Si hay un moderador, cambiamos su rol a admin
			const moderator = otherUsers.find(chatUser => chatUser.rol === 'moderator');
			if (moderator) {
				moderator.rol = 'admin';
				await this.chatUsersRepository.save(moderator);
			} else {
				// Si no hay moderador, hacemos admin al usuario más antiguo
				otherUsers.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
				otherUsers[0].rol = 'admin';
				await this.chatUsersRepository.save(otherUsers[0]);
			}
		}
	
		// Independientemente del rol, eliminamos al usuario solicitante del chat
		await this.chatUsersRepository.remove(requestingUser);
	}
	

}

// function services:
function cleanSensitiveUserData(user: any) {
	delete user.password;
	delete user.isActive;
	delete user.twoFASecret;
	delete user.images;
	delete user.roles;
	delete user.first_time;
	delete user.email;
}
