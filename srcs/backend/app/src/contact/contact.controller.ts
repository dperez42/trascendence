import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { Auth, ValidRoles } from '../auth/interfaces';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateContactUserBlockDto } from './dto/block_user/update-contactUserBlock.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/auth/decorators';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService
  ) {}

  // block

  @Patch('/block-user')
  @Auth(ValidRoles.user)
  updateContactUserBlock(
    @Body() updateContactUserBlockDto: UpdateContactUserBlockDto,
    @GetUser() user: User,
  ) {
    return this.contactService.updateContactUserBlock(updateContactUserBlockDto, user);
  }
  
  @Get('/block-user')
  @Auth(ValidRoles.user)
  getBlockedUsers(
    @GetUser() user: User,
  ) {
    return this.contactService.getBlockedUsers(user);
  }
  //

  @Post()
  @Auth(ValidRoles.user)
  create(
    @Body() createContactDto: CreateContactDto,
    @GetUser() user: User,
  ) {
    return this.contactService.create(createContactDto, user);
  }

  @Get(':id')
  @Auth(ValidRoles.user)
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Get('dual/:id')
  @Auth(ValidRoles.user)
  findOneDual(@Param('id') id: string) {
    return this.contactService.findOneDual(id);
  }

  @Delete()
  @Auth(ValidRoles.user)
  remove(
    @Body() deleteContactDto: CreateContactDto,
    @GetUser() user: User,
  ) {
    return this.contactService.remove(deleteContactDto, user);
  }

  @Get('/block/:idUser/:idBlocked')
  @Auth(ValidRoles.user)
  findOneBlock(
    @Param('idUser') idUser: string,
    @Param('idBlocked') idBlocked: string,

  ) {
    return this.contactService.findOneBlock(idUser, idBlocked);
  }
}

