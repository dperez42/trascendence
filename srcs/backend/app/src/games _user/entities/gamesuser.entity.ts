import {
	BeforeInsert, BeforeUpdate,
	Column, Entity,
	JoinColumn,
	ManyToOne,
	OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from '../../user/entities/user.entity';


// @Entity() define la clase como una entidad de TypeORM.
// Clase User que representa la entidad de usuario en la base de datos.
@Entity('gamesUser')
export class GamesUser {
	
	@ApiProperty({
		example: '746ef755-a990-46b8-8b4b-feb1be6cb46c',
		description: 'Game Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	// Propiedad id del juego que es un identificador único generado automáticamente.
	id_gameuser: string;

	@ApiProperty({
		example: '9f6443c9-5397-4bc5-9cc3-245e2c720cc9',
		description: 'id de jugador anfitrión',
		uniqueItems: false,
	})
	/*
	@Column({
		type: 'text',
		unique: false,
		
	})
	*/
	@ManyToOne(() => User, (user) => user.gameuser)
    id: User
	// Propiedad id del jugador anfitrión que debe ser una cadena de caracteres.
	//id: string;

	// Propiedad user del usuario, de tipo texto y único.
	@ApiProperty({
		example: 'dperez-z',
		description: 'nick de jugador',
		uniqueItems: false,
	})
	@Column({
		type: 'text',
		unique: false,
	})
	nick: string;

	@ApiProperty({
		example: '4',
		description: 'goles a favor',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	goalf: number;

	@ApiProperty({
		example: '4',
		description: 'goles en contra',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	goalc: number;

	@ApiProperty({
		example: '4',
		description: 'WIN',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	win: number;

	@ApiProperty({
		example: '4',
		description: 'LOSE',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	los: number;

	@ApiProperty({
		example: '4',
		description: 'TIDE',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	tid: number;
	
	@ApiProperty({
		example: '4',
		description: 'Puntos',
		uniqueItems: false,
	})
	@Column({
		type: 'int',
		unique: false,
	})
	ptos: number;
	
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
	/*
	@ManyToOne(
		() => User,
		( user ) => user.gameuser,
		{ eager: true },
	)
	user: User;
	*/
}