import { ApiProperty } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

// Clase LoginUserDto para la validación de los datos del usuario al iniciar sesión.
export class LoginUserDto
{
	@ApiProperty({
		description: 'Email',
		maxLength: 30,
	})
	@IsString()
	@IsEmail()
	@Transform(({ value }) => value.toLowerCase())
	// Propiedad email del usuario que debe ser una cadena de caracteres y un correo electrónico válido.
	// Transforma el valor de la propiedad email a minúsculas.
	email: string;

	@ApiProperty({
		description: 'Password',
		maxLength: 30,
		format: 'password',
	})
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@Matches(
		/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'The password must have a Uppercase, lowercase letter and a number'
	})
	password: string;
}