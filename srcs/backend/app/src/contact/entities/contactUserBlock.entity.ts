import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ContactUserBlock {
	@ApiProperty({
		example: '1',
		description: 'Contact Id',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn()
	id: number;


	@Column({
		type: 'timestamp',
		nullable: true,
	})
	blockedAt?: Date;


	@ManyToOne(type => User)
	@JoinColumn({name: "userId"})
	user: User;

	@ManyToOne(type => User)
	@JoinColumn({name: "blockId"})
	block: User;
}
