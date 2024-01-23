import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Socket } from "socket.io";
import { Repository } from "typeorm";

import { ChatService } from "../../chat/chat.service";
import { CreateChatDto } from "../../chat/dto/create-chat.dto";
import { User } from "../../user/entities/user.entity";


@Injectable()
export class ChatMessageWsService {


	constructor(
		
		@InjectRepository(User)
    	private readonly userRepository: Repository<User>,
		private readonly chatService: ChatService,
	)
	{}

	async getUserChanelRegister(client: Socket, params: any, idUser: string) {
		try {
			const user: User = await this.userRepository.findOneBy( {id: idUser});
			let result;

			const ChatSend = new CreateChatDto();
			ChatSend.name = params.room;
			ChatSend.description = params.topic ?? null;

			if (params.password && params.password.length > 1) {
				ChatSend.password = params.password;
				ChatSend.private = true;
			}

			result = await this.chatService.create(ChatSend, user);

			if (result.chat.chatUser)
			delete result.chat.chatUser;

			const returnchatDto = this.filterChatFields(result.chat);
			return { returnchatDto, register: result.register };

		} catch (error) {
			throw new BadRequestException('Error al registrar el usuario en el canal: ' + error.message);
		}
	}

	filterChatFields(chat) {
		const { user, password, ...chatWithoutUserAndPassword } = chat;
		const { password: userPassword, roles, images, isActive, email, ...userWithoutSensitiveInfo } = user;
		return { ...chatWithoutUserAndPassword, user: userWithoutSensitiveInfo };
	}
}
