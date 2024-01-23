import { PartialType } from '@nestjs/swagger';
import { CreateContactUserBlockDto } from './create-contactUserBlock.dto';

export class UpdateContactUserBlockDto extends PartialType(CreateContactUserBlockDto) {}
