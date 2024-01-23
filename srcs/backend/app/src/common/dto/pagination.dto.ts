import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {
  
	@ApiProperty({
		default: 10,
		description: 'Number of items per page',
	})
	@IsOptional()
	@IsPositive()
	@Type ( () => Number )
	limit?: number;
	
	@ApiProperty({
		default: 0,
		description: 'Do you want to skip items?',
	})
	@IsOptional()
	@Min ( 0 )
	@Type ( () => Number )
	offset?: number;
}