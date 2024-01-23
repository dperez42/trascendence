import { BadRequestException, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Logger } from '@nestjs/common/services/logger.service';

export class ExceptionService {
  private readonly logger = new Logger(ExceptionService.name);

  handleBadRequestException(detail: string, message: string) {
    throw new BadRequestException({ detail, message });
  }

  handleNotFoundException(detail: string, message: string) {
    throw new NotFoundException({ detail, message });
  }

  handleConflictException(detail: string, message: string) {
    throw new ConflictException({ detail, message });
  }

  handleInternalServerErrorException(error: any) {
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  handleDBExceptions(error: any) {
    if (error.status === 400)
      this.handleBadRequestException(error.detail, error.response.message);
    
    if (error.status === 404)
      this.handleNotFoundException(error.detail, error.response.message);

    if (error.status === 409)
      this.handleConflictException(error.detail, error.response.message);
  
    this.handleInternalServerErrorException(error);
  }
}
