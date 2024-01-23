import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { TokenError } from 'passport-oauth2'; 

@Catch(TokenError)
export class TokenErrorFilter implements ExceptionFilter {
  catch(exception: TokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Aquí podemos personalizar la respuesta que se envía al cliente
    response
      .status(401)
      .json({
        statusCode: 401,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: 'Invalid authorization grant',
      });
  }
}