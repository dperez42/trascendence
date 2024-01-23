import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact {
	@ApiProperty({
		example: '1',
		description: 'Contact Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn()
	id: number;

	@ApiProperty({
		example: 'true',
		description: 'Is active user',
		default: false,
	})
	@Column({
		type: 'boolean',
		default: false,
	})
	blocked: boolean;


	@ManyToOne(type => User)
	@JoinColumn({name: "userId"})
	user: User;

	@ManyToOne(type => User)
	@JoinColumn({name: "contactId"})
	contact: User;
}
