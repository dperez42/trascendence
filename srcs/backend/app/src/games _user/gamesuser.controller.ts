import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth, ValidRoles } from '../auth/interfaces';
import { GamesUserService } from './gamesuser.service';
//import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Games-User')
@Controller('gamesuser')
export class GamesUserController {
  constructor(private readonly gamesUserService: GamesUserService) {}
  @Post()
  @Auth(ValidRoles.user)
  create(@Body() createGameDto: any) {
      return this.gamesUserService.create(createGameDto);
  }

  @Get()
  @Auth(ValidRoles.user)
  findAll() {
    return this.gamesUserService.findAll();
  }
  
  @Get(':id')
  @Auth(ValidRoles.user)
  findBy(@Param('id') id: string) {
    return this.gamesUserService.findBy(id);
  }

    //new stats chat:
  @Get('chat-stats/:identifier')
  @Auth(ValidRoles.user)
  findByUser(
    @Param('identifier') identifier: string,
  ) {
    return this.gamesUserService.findByUser(identifier);
  }
}