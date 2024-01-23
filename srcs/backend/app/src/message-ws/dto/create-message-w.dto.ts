import { IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Params {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  target?: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  command: string;

}

export class CreateMessageWDto {

  @IsObject()
  @ValidateNested()
  @Type(() => Params)
  params: Params;

  @IsString()
  @IsOptional()
  timestamp?: string;
}
