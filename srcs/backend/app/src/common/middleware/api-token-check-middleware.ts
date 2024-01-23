import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";


export class ApiTokenCheckMiddleware implements NestMiddleware
{
	use(req: Request, res: Response, next: NextFunction)
	{
		next();
	}
}