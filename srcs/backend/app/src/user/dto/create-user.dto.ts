import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

// Clase CreateUserDto para la validación de los datos del usuario al registrarse.
export class CreateUserDto {
	
	@ApiProperty({
		description: 'Email',
		maxLength: 30,
		required: true,
	})
	@IsString()
	@IsEmail()
	// Propiedad email del usuario que debe ser una cadena de caracteres y un correo electrónico válido.
	email: string;

	@ApiProperty({
		description: 'Password',
		maxLength: 20,
		required: true,
	})
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	// Propiedad password del usuario que debe ser una cadena de caracteres y tener una longitud mínima de 6 y máxima de 20.
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	// Propiedad password del usuario que debe ser una cadena de caracteres,
	// con una longitud entre 6 y 20 caracteres,
	// y contener al menos una letra mayúscula, una letra minúscula y un número.
	password: string;

	@ApiProperty({
		description: 'Name',
		minLength: 5,
		maxLength: 20,
		required: true,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(20)
	// Propiedad name del usuario que debe ser una cadena de caracteres con una longitud mínima de 5 caracteres.
	name: string;

	@ApiProperty({
		description: 'Last Name',
		minLength: 5,
		maxLength: 20,
		required: true,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(20)
	// Propiedad lastName del usuario que debe ser una cadena de caracteres con una longitud mínima de 5 caracteres.
	lastName: string;

	@ApiProperty({
		description: 'Login',
		minLength: 5,
		maxLength: 10,
		required: true,
	})
	@IsString()
	@MinLength(5)
	@MaxLength(10)
	// Propiedad user del usuario que debe ser una cadena de caracteres con una longitud mínima de 5 caracteres y maximo 10.
	login: string;

	@ApiProperty({
		description: 'First connection',
	})
	@IsBoolean()
	// Propiedad user del usuario que debe ser una cadena de caracteres con una longitud mínima de 5 caracteres y maximo 10.
	first_time: boolean;

	@IsString()
	@IsOptional()
	twoFASecret: string;

	// @ApiProperty({
	// 	description: 'uploads/noiamge.jpg',
	// 	maxLength: 200,
	// })
	// @IsString()
	// @IsOptional()
	// @MaxLength(200)
	// images: string;
}