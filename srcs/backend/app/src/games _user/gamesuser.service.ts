import { Injectable, Logger, NotFoundException } from '@nestjs/common';

//import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '../auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { GamesUser } from './entities/gamesuser.entity';
import { User } from '../user/entities/user.entity'
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { ExceptionService } from '../services/exception.service';

@Injectable()
export class GamesUserService {
  private readonly logger = new Logger("Game Logic");
  constructor(
    @InjectRepository(GamesUser)
    //@InjectRepository(User)
    private gamesuserRepository: Repository<GamesUser>,
    private exceptionService: ExceptionService,
    //private userRepository: Repository<User>,
  )
  {}

  async create(createGameDto: any) {
    try {
      this.logger.log("Estadistica jugador guardada:" + JSON.stringify(createGameDto) );
      return this.gamesuserRepository.save(createGameDto);
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
        const data =  await this.gamesuserRepository.createQueryBuilder("t1")
            .select("SUM(ptos)","Ptos")
            .addSelect("SUM(win)","Wins")
            .addSelect("SUM(los)","Loses")
            .addSelect("SUM(tid)","Tides")
            .addSelect("SUM(goalf)","GF")
            .addSelect("SUM(goalC)","GC")
            //.addSelect("COUNT(player_id)","Games")
            .leftJoin('t1.id', 't2')
            .addSelect(['t2.id,  t2.login','t2.images'])
            //.where('player_id= :playerid', {playerid: id})
            .groupBy("t2.id, t2.login, t2.images")
            .orderBy({
              "SUM(ptos)": "DESC",
              //"user.id": "DESC", 
            })
            .printSql()
            .getRawMany()
        //console.log(data)
        return data
      } catch (error) {
        this.exceptionService.handleDBExceptions(error);
      }
  }
  //https://typeorm.biunav.com/en/select-query-builder.html#how-to-create-and-use-a-querybuilder
  async findBy(id: string) {
    try {
      const data =  await this.gamesuserRepository.createQueryBuilder("t1")
          .select("SUM(ptos)","Ptos")
          .addSelect("SUM(win)","Wins")
          .addSelect("SUM(los)","Loses")
          .addSelect("SUM(tid)","Tides")
          .addSelect("SUM(goalf)","GF")
          .addSelect("SUM(goalc)","GC")
          //.addSelect("COUNT(player_id)","Games")
          .leftJoin('t1.id', 't2')
          .addSelect(['t2.id,  t2.login','t2.images'])
          .where('t2.id= :playerid', {playerid: id})
          .groupBy("t2.id,t2.login, t2.images")
          .orderBy({
            "SUM(ptos)": "DESC",
            //"user.id": "DESC", 
          })
          .printSql()
          //.getOne()
          .getRawMany()
          //.orderBy({
          //  "user.name": "ASC",
          //  "user.id": "DESC", 
          // })
          return data
    } catch (error) {
          this.exceptionService.handleDBExceptions(error);
    }
  }
  //new stats chat:
  async findByUser(userId: string) {
      try {
          // Primera consulta: Resumen
          const summaryData = await this.gamesuserRepository.createQueryBuilder("gamesUser")
              .select([
                  "SUM(gamesUser.ptos) as Ptos",
                  "SUM(gamesUser.win) as Wins",
                  "SUM(gamesUser.los) as Loses",
                  "SUM(gamesUser.tid) as Tides",
                  "SUM(gamesUser.goalf) as GF",
                  "SUM(gamesUser.goalc) as GC",
                  "user.id as userId",
                  "user.login as userLogin"
              ])
              .innerJoin("gamesUser.id", "user")
              .where("user.id = :userId", { userId: userId })
              .groupBy("user.id")
              .orderBy({
                  "SUM(gamesUser.ptos)": "DESC"
              })
              .getRawOne();
  
          // Segunda consulta: Detalle de los juegos
          const detailedData = await this.gamesuserRepository.createQueryBuilder("gamesUser")
              .select([
                  "gamesUser.nick as opponentNick",
                  "gamesUser.goalf as goalsFor",
                  "gamesUser.goalc as goalsAgainst",
                  "CASE WHEN gamesUser.win = 1 THEN 'Win' WHEN gamesUser.los = 1 THEN 'Lost' ELSE 'Tied' END as result"
              ])
              .where("gamesUser.id = :userId", { userId: userId })
              .orderBy("gamesUser.timestamp", "DESC")
              .getRawMany();
  
          // Combinar ambos resultados
          const combinedData = {
              ...summaryData,
              gameDetails: detailedData
          };
  
          return combinedData;
  
      } catch (error) {
          this.exceptionService.handleDBExceptions(error);
      }
  }
}