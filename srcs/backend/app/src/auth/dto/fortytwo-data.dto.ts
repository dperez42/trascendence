import { IsArray, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FortyTwoDataDto
{

	@IsString()
	@IsEmail()
	readonly email: string;

	@IsString()
	readonly name: string;

	@IsString()
	readonly lastName: string;

	@IsString()
	@MinLength(2)
	@MaxLength(20)
	readonly login: string;

	@IsString()
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	readonly password: string;

	@IsString({ each: true })
	@IsArray()
	@IsOptional()
	images: string[];
}