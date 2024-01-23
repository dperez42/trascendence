import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';

// Función decoradora GetUser para extraer información del usuario del objeto de solicitud.
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // Obtiene el objeto de solicitud del contexto de ejecución.
    const request = ctx.switchToHttp().getRequest();
    // Extrae el objeto user del objeto de solicitud.
    const user = request.user;

    // Lanza una excepción si el objeto user no está presente.
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    // Retorna el objeto user completo o solo el campo especificado por data.
    return !data ? user : user[data];
  },
);

/**
Este archivo define la función decoradora GetUser, que se utiliza
para extraer información del usuario del objeto de solicitud en los
controladores. La función toma un argumento opcional data que indica
el campo del objeto user que se desea extraer. Si no se especifica
data, se devuelve el objeto user completo.
 */