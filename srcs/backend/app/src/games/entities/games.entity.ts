import {
	BeforeInsert, BeforeUpdate,
	Column, Entity,
	JoinColumn,
	ManyToOne,
	OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Chat } from "../../chat/entities";
import { ChatUser } from "../../chat-user/entities/chat-user.entity";
import { Contact } from "../../contact/entities/contact.entity";


// @Entity() define la clase como una entidad de TypeORM.
// Clase User que representa la entidad de usuario en la base de datos.
@Entity('games')
export class Games {
	
	@ApiProperty({
		example: '746ef755-a990-46b8-8b4b-feb1be6cb46c',
		description: 'Game Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	// Propiedad id del juego que es un identificador único generado automáticamente.
	id: string;

	@ApiProperty({
		example: '9f6443c9-5397-4bc5-9cc3-245e2c720cc9',
		description: 'id de jugador anfitrión',
		uniqueItems: false,
	})
	@Column({
		type: 'text',
		unique: false,
		
	})
	// Propiedad id del jugador anfitrión que debe ser una cadena de caracteres.
	p1_id: string;

	// Propiedad user del usuario, de tipo texto y único.
	@ApiProperty({
		example: 'dperez-z',
		description: 'nick de jugador anfitrion',
		uniqueItems: false,
	})
	@Column({
		type: 'text',
		unique: false,
	})
	p1_nick: string;

	@ApiProperty({
		example: '9f6443c9-5397-4bc5-9cc3-245e2c720cc9',
		description: 'id de jugador visitante',
		uniqueItems: false,
	})
	@Column({
		type: 'text',
		unique: false,
		
	})
	p2_id: string;

	@ApiProperty({
		example: 'dperez-z',
		description: 'nick de jugador anfitrion',
		uniqueItems: false,
	})
	@Column({
		type: 'text',
		unique: false,
	})
	p2_nick: string;

	@ApiProperty({
		example: '4',
		description: 'goles de jugador anfitrion',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	p1_goals: number;

	@ApiProperty({
		example: '4',
		description: 'goles de jugador visitante',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	p2_goals: number;

	@ApiProperty({
		example: '4',
		description: 'puntos de jugador anfitrion',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	p1_ptos: number;

	@ApiProperty({
		example: '4',
		description: 'puntos de jugador visitante',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	p2_ptos: number;

	@ApiProperty({
		example: '',
		description: 'timestamp final de partida',
		uniqueItems: false,
	})
	@Column({
		type: 'bigint',
		unique: false,
	})
	timestamp: number;
}