import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateContactDto {

	// @ApiProperty({
	// 	description: 'Id of the user',
	// })
	// @IsNotEmpty()
	// userId: string;

	@ApiProperty({
		example: 'bef07ec7-c562-4b9d-a634-d7eec302aa72',
    	description: 'Contact Id',
	})
	@IsNotEmpty()
	contactId: string;
	
	@ApiProperty({
		example: 'false',
    	description: 'blocked contact',
	})
	blocked?: boolean;
}
