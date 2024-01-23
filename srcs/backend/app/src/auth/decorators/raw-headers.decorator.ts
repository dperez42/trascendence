import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// Función decoradora RawHeaders para extraer las cabeceras sin procesar del objeto de solicitud.
export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // Obtiene el objeto de solicitud del contexto de ejecución.
    const request = ctx.switchToHttp().getRequest();
    // Retorna las cabeceras sin procesar del objeto de solicitud.
    return request.rawHeaders;
  },
);
/**
Este archivo define la función decoradora RawHeaders, que se utiliza
para extraer las cabeceras sin procesar del objeto de solicitud en los
controladores. La función toma un argumento opcional data que indica
el campo del objeto user que se desea extraer. Si no se especifica
data, se devuelve el objeto user completo.
 */