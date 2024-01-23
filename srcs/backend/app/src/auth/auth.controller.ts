import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

import { CreateUserDto, LoginUserDto } from './dto/';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { GetUser } from './decorators/';

import { Auth, ValidRoles } from './interfaces';

interface ResponseMessage {
  status: string;
  message: string;
}

@ApiTags('Login Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  // Ruta de registro de nuevos usuarios.
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  // Ruta para el inicio de sesión de usuarios.
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Ruta para verificar el estado de autenticación del usuario.
  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  
  @Get('42')
  @UseGuards(AuthGuard('42'))
  fortyTwoLogin() {
    // Inicia el proceso de autenticación con 42
  }


  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  fortyTwoCallback(@Req() req: Request, @Res() res: Response) {
      const user = req.user;
      this.authService.loginOrCreateWith42(user).then(jwt => {
          let host = req.headers.host;
          const protocol = req.secure ? 'https' : 'http';
          host =  host.split(':')[0]+':8080'
          return res.redirect(`${protocol}://${host}?token=${jwt.token}`);
      });
  }

  @Get('generate-2fa')
  async generateTwoFA() {
    return this.authService.generateTwoFA();
  }

  @Post('validate-2fa')
  validateTwoFA(@Body('secret') secret: string, @Body('token') token: string) {
    return {
      isValid: this.authService.validateTwoFAToken(secret, token)
    };
  }

  @Post('validate-2fa-login')
  @Auth(ValidRoles.user)
  async validateTwoFALogin(
    @Req() req: any, 
    @GetUser() user: User,
    @Res() res: Response
  ) : Promise<Response> {

    const token = req.body.token;
    const isValid = this.authService.validateTwoFAToken(user.twoFASecret, token);
    if (isValid) {
      return res.status(200).json({ status: 'success', message: '2FA enabled successfully' });
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
  }

  @Post('enable-2fa')
  @Auth(ValidRoles.user)
  async enableTwoFA(
    @Req() req: any, 
    @GetUser() user: User,
    @Res() res: Response
  ): Promise<Response> {
    const secret = req.body.secret;
    const token = req.body.token;

    const isValid = this.authService.validateTwoFAToken(secret, token);
    if (isValid) {
      await this.authService.saveTwoFASecret(user.id, secret);
      return res.status(200).json({ status: 'success', message: '2FA enabled successfully' });
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid token' });
    }
  }
  

  @Post('disable-2fa')
  async disableTwoFA(user: User): Promise<ResponseMessage> {
    await this.authService.disableTwoFA(user.id);
    return { status: 'success', message: '2FA disabled successfully' };
  }
}
