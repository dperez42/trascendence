import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth, ValidRoles } from '../auth/interfaces';
import { GamesService } from './games.service';
//import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Games')
@Controller('games')
export class GamesController {
    constructor(
        private readonly gamesService: GamesService,
    ) {}
    @Post()
    @Auth(ValidRoles.user)
    create(@Body() createGameDto: any) {
        return this.gamesService.create(createGameDto);
    }

    @Get()
    @Auth(ValidRoles.user)
    findAll() {
      // return ("test")
      return this.gamesService.findAll();
    }

    @Get('listlivegames')
    @Auth(ValidRoles.user)
    liveGamesList() {
      return this.gamesService.liveGamesList();
    }

    @Get('roomwaiting')
    @Auth(ValidRoles.user)
    waitingRoom() {
      return (this.gamesService.waitingRoom());
    }

    @Get(':id')
    @Auth(ValidRoles.user)
    findBy(@Param('id') id: string) {
      return this.gamesService.findBy(id);
    }
    //char stats:
    @Get('stats-chat/:id')
    @Auth(ValidRoles.user)
    findPlayerGameDetails(
      @Param('id') id: string
    ){
      return this.gamesService.findPlayerGameDetails(id);
    }

    @Get('stats-chat-general/:id')
    @Auth(ValidRoles.user)
    getPlayerStats(
      @Param('id') id: string
    ){
      return this.gamesService.getPlayerStats(id);
    }
}