// import {
// 	ExceptionFilter,
// 	Catch,
// 	ArgumentsHost,
// 	BadRequestException,
// 	HttpException,
// 	InternalServerErrorException,
// 	ConflictException,
//   } from '@nestjs/common';
//   import { Request, Response } from 'express';
  
//   @Catch(BadRequestException, InternalServerErrorException, ConflictException)
//   export class CustomExceptionFilter implements ExceptionFilter {
// 	catch(exception: HttpException, host: ArgumentsHost) {
// 	  const ctx = host.switchToHttp();
// 	  const response = ctx.getResponse<Response>();
// 	  const request = ctx.getRequest<Request>();
// 	  const status = exception.getStatus();
  
// 	  if (exception instanceof BadRequestException || exception instanceof InternalServerErrorException) {
// 		const { message, ...otherProperties } = exception.getResponse() as any;
// 		response.status(status).json({
// 		  statusCode: status,
// 		  timestamp: new Date().toISOString(),
// 		  path: request.url,
// 		  message,
// 		  ...otherProperties,
// 		});
// 	  } else if (exception instanceof ConflictException) {
// 		const { message } = exception.getResponse() as any;
// 		response.status(status).json({
// 		  statusCode: status,
// 		  timestamp: new Date().toISOString(),
// 		  path: request.url,
// 		  message,
// 		});
// 	  } else {
// 		response.status(status).json({
// 		  statusCode: status,
// 		  timestamp: new Date().toISOString(),
// 		  path: request.url,
// 		  message: exception.message,
// 		});
// 	  }
// 	}
//   }
  
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	BadRequestException,
	HttpException,
	InternalServerErrorException,
	ConflictException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch(BadRequestException, InternalServerErrorException, ConflictException)
  export class CustomExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
	  const ctx = host.switchToHttp();
	  const response = ctx.getResponse<Response>();
	  const request = ctx.getRequest<Request>();
	  const status = exception.getStatus();
	  const exceptionResponse = exception.getResponse() as any;
  
	  let message = exception.message;
	  let otherProperties = {};
  
	  if (exception instanceof BadRequestException || exception instanceof InternalServerErrorException) {
		const { message: exceptionMessage, ...otherProps } = exceptionResponse;
		message = exceptionMessage;
		otherProperties = otherProps;
	  } else if (exception instanceof ConflictException) {
		message = exceptionResponse.message;
	  }
  
	  response.status(status).json({
		statusCode: status,
		timestamp: new Date().toISOString(),
		path: request.url,
		message,
		...otherProperties,
	  });
	}
  }