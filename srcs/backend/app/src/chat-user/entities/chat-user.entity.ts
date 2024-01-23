import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Chat } from '../../chat/entities';
import { User } from '../../user/entities/user.entity';

@Entity()
export class ChatUser
{
	@ApiProperty({
		example: '1',
		description: 'Chat_user Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn()
	id: number;
	
	//
	@ManyToOne(() => Chat,
    (chat) => chat.chatUser,
    { 
        nullable: false,
        onDelete: 'CASCADE',
    })
	@JoinColumn({ name: 'chatId' })
	@IsNotEmpty()
	chat: Chat;

	//
	@ManyToOne(
		() => User,
		( user ) => user.chat,
		{ eager: true },
	)
	user: User;

	@ApiProperty({
        example: 'user',
        description: 'Role of the user (e.g., moderator, user, etc.)',
    })
    @Column({ type: 'varchar', default: 'user' })
    rol: string;

	@ApiProperty({
        example: 'false',
        description: 'Silence the user in the chat',
    })
    @Column({ type: 'boolean', default: 'false' })
    silence: boolean;

	@ApiProperty({
        example: '2023-09-24T12:34:56.000Z',
        description: 'Creation date',
    })
    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}
