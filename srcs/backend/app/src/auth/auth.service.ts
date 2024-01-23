import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';

import { LoginUserDto, CreateUserDto } from './dto';
import { User } from '../user/entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    // Inyecta el repositorio de User y el servicio Jwt.
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Método para iniciar sesión de un usuario.
  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    
    // Busca al usuario por su correo electrónico.
    const user = await this.userRepository.findOneBy({ email: email });

    // Verifica si el correo electrónico y la contraseña coinciden.
    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');

    // Retorna el usuario logueado junto con su token JWT.
    return {
      // ...this.filterCreate(user),
      authentication: user.hasTwoFASecret,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  //login with 42 or create user
  // async loginOrCreateWith42( user: any ) {
  //   const { email, name, lastName, login, password, image } = user;

  //   // Busca al usuario por su correo electrónico.
  //   const userDB= await this.userRepository.findOne({
  //     where: { email },
  //     select: { email: true, password: true, id: true },
  //   });
  //   // Verifica si el correo electrónico coincide.
  //   if (!userDB) {
  //     // create user
  //     const newUser = await this.userRepository.save({
  //       email,
  //       password,
  //       name,
  //       lastName,
  //       // dan
  //       login:'ssdd',
  //       images: image.link,
  //     });

  //     delete newUser.password;
  //     // // Retorna el usuario logueado junto con su token JWT.
  //     return {
  //       token: this.getJwtToken({ id: newUser.id }),
  //     };
  //   }

  //   // Retorna el usuario logueado junto con su token JWT.
  //   return {
  //     // ...userDB,
  //     token: this.getJwtToken({ id: userDB.id }),
  //   };
  // }

  async loginOrCreateWith42(user: any) {
    const { email, name, lastName, login, password, image } = user;
  
    // Busca al usuario por su correo electrónico.
    const userDB = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, login: true },
    });
  
    // Verifica si el correo electrónico coincide.
    if (!userDB) {
      // Genera un nombre de usuario único si es necesario
      let uniqueLogin = login;
      while (await this.userRepository.findOne({ where: { login: uniqueLogin } })) {
        uniqueLogin = `${login}_${Math.random().toString(36).slice(2, 11)}`;
      }
      // Crea el usuario
      const newUser = await this.userRepository.save({
        email,
        password,
        name,
        lastName,
        login: uniqueLogin,
        images: image.link,
      });
  
      delete newUser.password;
  
      // Retorna el usuario logueado junto con su token JWT.
      return {
        token: this.getJwtToken({ id: newUser.id }),
      };
    }
  
    // Retorna el usuario logueado junto con su token JWT.
    return {
      token: this.getJwtToken({ id: userDB.id }),
    };
  }
    
  // Método para verificar el estado de autenticación del usuario.
  async checkAuthStatus(user: User) {
    return {
      // ...this.filterCreate(user),
      token: this.getJwtToken({ id: user.id }),
    };
  }

  // Método privado para generar el token JWT.
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  // Método privado para manejar errores de base de datos.
  private handleDBError(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Please check server logs');
  }

  // Método para crear un nuevo usuario.
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      // Crea un nuevo usuario y encripta su contraseña.
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      // Guarda el usuario en la base de datos.
      await this.userRepository.save(user);

      // Retorna el usuario creado junto con su token JWT.
      return {
        // ...this.filterCreate(user),
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async findOrCreate42User(profile: any): Promise<User> {
    const { _json } = profile;
  
    let user = await this.userRepository.findOne({ where: { email: _json.email } });

  
    if (!user) {
      // Crear un nuevo usuario si no existe
      user = this.userRepository.create({
        // Asigne los valores adecuados del perfil a los campos del usuario
        email: _json.email,
        name: _json.first_name,
        lastName: _json.last_name,
      });
  
      await this.userRepository.save(user);
    }
  
    return user;
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: userId } });
  
    if (!user) {
      throw new Error(`User not found with ID ${userId}`);
    }
  
    return user;
  }

  // filters
  filterCreate(user: any)
  {
    const {isActive, roles, password, ...newUser} = user;
    return { ...newUser };
  }

  async generateTwoFA(): Promise<{ secret: string; QRCodeURL: string }> {
    const secret = speakeasy.generateSecret({ length: 20 });
    const QRCodeURL = await qrcode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      QRCodeURL
    };
  }

  validateTwoFAToken(userSecret: string, userToken: string): boolean {
    return speakeasy.totp.verify({
      secret: userSecret,
      encoding: 'base32',
      token: userToken,
    });
  }

  async saveTwoFASecret(userId: string, secret: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: {id: userId} } );
    user.twoFASecret = secret;
    return this.userRepository.save(user);
  }

  async disableTwoFA(userId: string): Promise<User> {
    const user = await this.userRepository.findOne( {where: {id: userId} });
    user.twoFASecret = null;
    return this.userRepository.save(user);
  }
}
