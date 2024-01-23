import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional} from 'class-validator';

export class CreateChatUserDto {


  @ApiProperty({
		description: 'Id of the chat',
	})
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({
		description: 'Id of the chat',
	})
  @IsOptional()
  rol?: string;

  @ApiProperty({
		description: 'Silence the user in the chat',
    default: 'false'
	})
  @IsOptional()
  silence?: boolean;
}
