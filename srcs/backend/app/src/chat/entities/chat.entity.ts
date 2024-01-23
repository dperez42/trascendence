import {Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { ChatUser } from 'src/chat-user/entities/chat-user.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

@Entity()
export class Chat {
	
	@ApiProperty({
		example: '746ef755-a990-46b8-8b4b-feb1be6cb46c',
		description: 'Chat Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'Juegos de Master',
		description: 'Title of the chat',
		uniqueItems: true,
	})
	@ApiProperty()
	@Column('text', {
		unique: true,
	})
	name: string;

	@ApiProperty({
		example: 'juegos rapidos con tres toques',
		description: 'Chat description',
		default: null,
	})
	@ApiProperty()
	@Column({
		type: 'text',
		nullable: true,
	})
	description: string;

	@ApiProperty({
		example: 'true',
		description: 'chat is private password is required',
	})
	@ApiProperty()
	@Column('boolean', {
		default: false,
	})
	private: boolean;

	@ApiProperty({
		example: 'juegos-de-master',
		description: 'Chat slug url',
		uniqueItems: true,
	})
	@ApiProperty()
	@Exclude()
	@Column({
		type: 'text',
		unique: true,
	})
	slug: string;

	@ApiProperty({
		example: 'password',
		description: 'password must be longer than or equal to 5 characters',
	})
	@ApiProperty()
	@Column({
		type: 'text',
		nullable: true,
	})
	password: string;

	@ApiHideProperty()
	// @ApiProperty()
	@OneToMany(
		() => ChatUser,
		(chatUsers) => chatUsers.chat,
		{ cascade: true, eager: true }
	)
	chatUser: ChatUser[];

	@ManyToOne(
		() => User,
		( user ) => user.chat,
		{ eager: true },
	)
	user: User;
	
	@BeforeInsert()
	checkSlugIsert() {
		if (!this.slug) {
			this.slug = this.name;
		}
		
		this.slug = this.slug.replace(/\s/g, '-').toLowerCase();
	}

	@BeforeUpdate()
	checkSlugUpdate() {		
		this.slug = this.name
		.replaceAll(' ', '-')
		.replaceAll("'", '')
		.toLowerCase();
	}
}
