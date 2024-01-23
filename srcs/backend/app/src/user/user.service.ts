import { ConflictException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '../auth/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CustomHttpException } from 'src/chat/exceptions/custom-http-exception';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  )
  {}

  async create(createUserDto: CreateUserDto) {
    return `This action returns all user`;
  }

  async findAll() {
    const user = await this.userRepository.find();

    return user.map( ({ ...res }) =>({
        ...res
    })) ;
  }

  async findOne(identifier: string) {
    if (!isUUID(identifier))
      throw new NotFoundException(`The id	${ identifier } is no UUID`);

    const user = await this.userRepository.findOne({ where: { id: identifier } });
    // console.log('user:',  user.hasTwoFASecret);
    if (!user) {
        throw new NotFoundException(`User with id	${ identifier } not found`);
    }
    return user;
  }

  async findOne2F(identifier: string) {
    if (!isUUID(identifier))
      throw new NotFoundException(`The id	${ identifier } is no UUID`);

    const user = await this.userRepository.findOne({ where: { id: identifier } });
    // console.log('user:',  user.hasTwoFASecret);
    if (!user) {
        throw new NotFoundException(`User with id	${ identifier } not found`);
    }
    return  user.hasTwoFASecret;
  }

  async saveUserTwoFASecret(userId: string, secret: string): Promise<void> {
    const user = await this.userRepository.findOne({where: {id: userId}});
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    user.twoFASecret = secret;
    await this.userRepository.save(user);
  }

  updateById(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async update(updateUserDto: UpdateUserDto, user: User) {
    try {
      const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
  
      if (!foundUser) {
          throw new NotFoundException(`User with ID ${user.id} not found`);
      }
      
      // Actualiza los campos necesarios
      Object.assign(foundUser, updateUserDto);
  
      // Guarda el usuario actualizado
      const {password, isActive, ...rest} = await this.userRepository.save(foundUser);
      return rest;
    } catch (error) {
      if (error.code === '23505') {  // 23505 es el código de error de PostgreSQL para violaciones de restricciones únicas
        throw new ConflictException('El recurso ya existe o está duplicado.');
      }
      throw new InternalServerErrorException();  // Si no es un error conocido, simplemente lanza un error 500
    }
  }

  async updateRole(updateRoleDto: any, user: User) {
    try {
      const { id, rol } = updateRoleDto;
      const foundUser = await this.userRepository.findOne({ where: { id } });
      
      if (!foundUser) {
        throw new HttpException(`Chat ${id} no found`, HttpStatus.FORBIDDEN);
      }

      if (foundUser.roles.some(role => role === 'admin'))
        throw new CustomHttpException('', false, `the user is admin, you can't change role`, HttpStatus.BAD_REQUEST);

      let rolesToUpdate = ['user'];
      
      if (rol === 'super-user') {
        rolesToUpdate.push('super-user');
      }
      
      Object.assign(foundUser, { roles: rolesToUpdate });
      const { password, isActive, ...rest } = await this.userRepository.save(foundUser);
      return rest;
      
    } catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			if (error.code === '23505') {
				throw new ConflictException('error in update role');
			  }
			  throw new InternalServerErrorException(); 
		}
  }

   async updateActivity(updateActivityDto: any, user: User) {
    try {
      const { id, activity } = updateActivityDto;
      const foundUser = await this.userRepository.findOne({ where: { id } });
      
      if (!foundUser) {
        throw new HttpException(`Chat ${id} no found`, HttpStatus.FORBIDDEN);
      }

      Object.assign(foundUser, { isActive: activity });
      const { password, isActive, ...rest } = await this.userRepository.save(foundUser);
      return rest;
      
    } catch (error) {
			if (error instanceof HttpException) {
				throw error;
			}
			if (error.code === '23505') {
				throw new ConflictException('error in update role');
			  }
			  throw new InternalServerErrorException(); 
		}
  }

  async updateUserImage(imagePath: string, user: User) {
    const foundUser = await this.userRepository.findOne({ where: { id: user.id } });
    
    if (!foundUser) {
        throw new NotFoundException(`User with ID ${user.id} not found`);
    }
    // Actualiza el campo images del usuario
    foundUser.images = imagePath;
  
    await this.userRepository.save(foundUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
