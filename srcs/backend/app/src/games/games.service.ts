import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

//import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '../auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from './entities/games.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import {GlobalServiceGames} from '../services/games.service'
import { ExceptionService } from '../services/exception.service';

@Injectable()
export class GamesService {
  private readonly logger = new Logger("Game Logic");
  constructor(
    @InjectRepository(Games)
    private gamesRepository: Repository<Games>,
    private exceptionService: ExceptionService,
    //private globalServiceGames: GlobalServiceGames
  )
  {}

  async create(createGameDto: any) {
    try {
      this.logger.log("Juego guardado:" + JSON.stringify(createGameDto) );
      return this.gamesRepository.save(createGameDto);
    } catch (error) {
          this.exceptionService.handleDBExceptions(error);
    }
  }

  async findAll() {
    try {
      return(GlobalServiceGames.waiting_room)
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }
  
  async findBy(id: string) {
    try {
      return this.gamesRepository.find(
          {where: [{ p1_id:id}, 
                  {p2_id:id}]})
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }
  }
  liveGamesList() {
    try {
      return (GlobalServiceGames.games)
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }  
  }
  waitingRoom() {
    try {
      return (GlobalServiceGames.waiting_room)
    } catch (error) {
      this.exceptionService.handleDBExceptions(error);
    }  
  }

  // chat stats:
  async findPlayerGameDetails(playerId: string) {
    try {
      const gameDetails = await this.gamesRepository.createQueryBuilder("games")
          .select([
              "games.id as gameId",
              "CASE WHEN games.p1_id = :playerId THEN games.p2_id ELSE games.p1_id END as opponentId",
              "CASE WHEN games.p1_id = :playerId THEN games.p2_nick ELSE games.p1_nick END as opponentNick",
              "CASE WHEN games.p1_id = :playerId THEN games.p2_goals ELSE games.p1_goals END as opponentGoals",
              "CASE WHEN games.p1_id = :playerId THEN games.p1_goals ELSE games.p2_goals END as playerGoals",
              "ABS(games.p1_goals - games.p2_goals) as goalDifference",
              "CASE WHEN games.p1_id = :playerId THEN games.p2_ptos ELSE games.p1_ptos END as opponentPoints",
              "CASE WHEN games.p1_id = :playerId THEN games.p1_ptos ELSE games.p2_ptos END as playerPoints",
              "ABS(games.p1_ptos - games.p2_ptos) as pointsDifference",
              "to_timestamp(games.timestamp/1000) as gameDate"
          ])
          .where("games.p1_id = :playerId OR games.p2_id = :playerId", { playerId: playerId })
          .orderBy("games.timestamp", "DESC")
          .getRawMany();
        if (!gameDetails) {
          throw new NotFoundException(`error result totalGames`);
        }
        return gameDetails;
      } catch (error) {
        if (error instanceof HttpException) {
          throw error;
        }
        throw new InternalServerErrorException(); 
      }
  }

  async getPlayerStats(playerId: string) {
    try {
      const defaultStats = {
          totalGames: 0,
          totalWins: 0,
          totalLosses: 0,
          winPercentage: 0,
          goalDifference: 0,
          averageGoalsPerGame: 0,
          // ... otros campos en cero si es necesario
      };

      const totalGames = await this.gamesRepository
          .createQueryBuilder("games")
          .where("games.p1_id = :playerId", { playerId })
          .orWhere("games.p2_id = :playerId", { playerId })
          .getCount();

      if (!totalGames) {
        return defaultStats;
      }

      const winsAndGoalsFor = await this.gamesRepository
          .createQueryBuilder("games")
          .select("SUM(CASE WHEN games.p1_id = :playerId THEN games.p1_goals ELSE games.p2_goals END)", "totalGoalsFor")
          .addSelect("COUNT(games.id)", "totalWins")
          .where("(games.p1_id = :playerId AND games.p1_ptos > games.p2_ptos) OR (games.p2_id = :playerId AND games.p2_ptos > games.p1_ptos)", { playerId })
          .getRawOne();
      if (!winsAndGoalsFor) {
        return defaultStats;
      }

      const lossesAndGoalsAgainst = await this.gamesRepository
          .createQueryBuilder("games")
          .select("SUM(CASE WHEN games.p1_id = :playerId THEN games.p2_goals ELSE games.p1_goals END)", "totalGoalsAgainst")
          .addSelect("COUNT(games.id)", "totalLosses")
          .where("(games.p1_id = :playerId AND games.p1_ptos < games.p2_ptos) OR (games.p2_id = :playerId AND games.p2_ptos < games.p1_ptos)", { playerId })
          .getRawOne();
      if (!lossesAndGoalsAgainst) {
        return defaultStats;
      }

      const totalWins = winsAndGoalsFor.totalWins;
      const totalGoalsFor = winsAndGoalsFor.totalGoalsFor;
      const totalLosses = lossesAndGoalsAgainst.totalLosses;
      const totalGoalsAgainst = lossesAndGoalsAgainst.totalGoalsAgainst;

      const winPercentage = (totalWins / totalGames) * 100;
      const goalDifference = totalGoalsFor - totalGoalsAgainst;
      const averageGoalsPerGame = totalGoalsFor / totalGames;

      return {
          totalGames,
          totalWins,
          totalLosses,
          winPercentage,
          goalDifference,
          averageGoalsPerGame,
          // ...
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(); 
    }
  }

}
