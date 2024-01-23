//import {GameDto} from './dto/game.dto'
import { Injectable} from '@nestjs/common';

@Injectable()
export class GlobalServiceGames{ 
    static games:any [] = [];
    static game_cfg: any = {  ///default configuration
      pad:[5,100],
      ballrad: 5,
      game_vel: 20,
      time_wait: 10,
      time_start: 5,
      time_play: 60,
      time_show: 5,
    };
    static waiting_room: any = null
 } 