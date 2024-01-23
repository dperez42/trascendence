import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(slug: string, join: boolean, message: string, statusCode: HttpStatus) {
    super({
      statusCode,
      slug,
      join,
      message,
      error: HttpStatus[statusCode],
    }, statusCode);
  }
}