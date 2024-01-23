import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateContactUserBlockDto {

	@ApiProperty({
		example: '6a598dfa-6cd7-4b96-b43b-1fe16a9f4db5',
		description: 'blocked contact  ID',
	})
	@IsNotEmpty()
	blockId: string;
	
	// @ApiProperty({
	// 	example: '2023-10-18T12:34:56Z',
    // 	description: 'blocked contact',
	// })
	blocked?: Date;

	@ApiProperty({
		example: '120',
		description: 'Duration of the block in seconds',
	})
	@IsNotEmpty()
	seconds: number;
}
