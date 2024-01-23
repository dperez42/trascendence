import {
	BeforeInsert, BeforeUpdate,
	Column, Entity,
	OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Chat } from "../../chat/entities";
import { ChatUser } from "../../chat-user/entities/chat-user.entity";
import { Contact } from "../../contact/entities/contact.entity";
import { GamesUser} from "../../games _user/entities/gamesuser.entity";
import { ContactUserBlock } from "src/contact/entities/contactUserBlock.entity";

// @Entity() define la clase como una entidad de TypeORM.
// Clase User que representa la entidad de usuario en la base de datos.
@Entity('users')
export class User {
	
	@ApiProperty({
		example: '746ef755-a990-46b8-8b4b-feb1be6cb46c',
		description: 'User Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'tester@tester.com',
		description: 'email of the user login',
		uniqueItems: true,
	})
	@Column({
		type: 'text',
		unique: true,
		
	})
	email: string;

	@ApiProperty({
		example: 'login user name',
		description: 'Chat Id',
		uniqueItems: true,
	})
	@Column({
		type: 'text',
		unique: true,
	})
	login: string;

	//
	@ApiProperty({
		example: 'first time',
		description: 'first connection',
	})
	@Column({
		type: 'boolean',
		default: true,
	})
	first_time: boolean;

	@ApiProperty({
		example: 'url image',
		description: 'images of the user avatar',
	})
	@Column({
		type: 'text',
		default: 'uploads/default.png',
	})
	images: string;

	@ApiProperty({
		example: 'Password1234',
		description: 'password of the user login',
	})
	@Column({
		type: 'text'
	})
	password: string;

	@ApiProperty({
		example: 'jhon',
		description: 'Name of the user',
	})
	@Column({
		type: 'text'
	})
	name: string;

	@ApiProperty({
		example: 'smith collins',
		description: 'Last Name of the user',
	})
	@Column({
		type: 'text'
	})
	lastName: string;

	@ApiProperty({
		example: 'true',
		description: 'Is active user',
		default: true,
	})
	@Column({
		type: 'boolean',
		default: true,
	})
	isActive: boolean;

	@ApiProperty({
		example: '["admin", "user", "superuser""]',
		description: 'Roles of the user',
	})
	@Column({
		type: 'text',
		array: true,
		default: ['user'],
	})
	roles: string[];

	//
	@Column({
		nullable: true,
	})
	twoFASecret?: string;

	get hasTwoFASecret(): boolean {
        return !!this.twoFASecret;
    }
	//
	@ApiProperty()
	@OneToMany(
		() => Chat,
		( chat ) => chat.user,
	)
	// Relación uno a muchos entre el usuario y el chat.
	chat: Chat
	
	@ApiProperty()
	@OneToMany(
		() => GamesUser,
		( gameuser) => gameuser.id,
	)
	// Relación uno a muchos entre el usuario y el chat.
	gameuser: GamesUser[]
	
	@ApiProperty()
	@OneToMany(
		() => ChatUser,
		( chatUsers ) => chatUsers.user,
	)
	chatUser: ChatUser


	@OneToMany(() => Contact, contact => contact.user, {
		cascade: true,
	})
  	contacts: Contact[];

	
	@OneToMany(() => ContactUserBlock, contactUserBlock => contactUserBlock.user, {
		cascade: true,
	})
	blocks: ContactUserBlock[];

	// Método que se ejecuta antes de insertar un nuevo registro de usuario en la base de datos.
	// Convierte el email a minúsculas.
	@BeforeInsert()
	checkFieldsBeforeInsert()
	{
		this.email = this.email.toLowerCase();
	}

	// Método que se ejecuta antes de actualizar un registro de usuario en la base de datos.
	// Convierte el email a minúsculas.
	@BeforeUpdate()
	checkFieldsBeforeUpdate()
	{
		this.checkFieldsBeforeInsert();
	}
}