import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

import { FortyTwoStrategy } from './strategies/42.strategy';

// AuthModule es el módulo encargado de gestionar la autenticación en la aplicación.
@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, FortyTwoStrategy],
  imports: [
    // Importa el módulo de configuración para obtener las variables de entorno.
    ConfigModule,

    // Registra el repositorio de User en el módulo TypeOrm.
    TypeOrmModule.forFeature([User]),

    // Registra el módulo Passport con la estrategia JWT como predeterminada.
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Registra el módulo Jwt de forma asíncrona y configura las opciones de firma del token.
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  // Exporta los módulos y estrategias para su uso en otros módulos.
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}


/**
Este archivo define el módulo de autenticación de la aplicación,
importando y configurando los módulos necesarios para la autenticación,
como Passport y JwtModule. Además, registra el repositorio de la entidad
User y exporta los módulos y estrategias utilizados para ser utilizados en
otros módulos de la aplicación.
*/