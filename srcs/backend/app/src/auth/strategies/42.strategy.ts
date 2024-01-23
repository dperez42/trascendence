import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
	private authService: AuthService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: process.env.FORTYTWO_CLIENT_ID,
      clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    // Aquí puedes obtener y guardar el perfil del usuario en tu base de datos
    // o hacer lo que necesites con los datos del usuario.
	try {
		const { id, _json } = profile;
	
		// return _json;
		return {
			email: _json.email,
			password: bcrypt.hashSync((Math.random() + 1).toString(36).substring(7), 10),
			name: _json.first_name,
			lastName: _json.last_name,
			login: _json.login,
			image: _json.image,
		};
		
	} catch (error) {
		return error;
	}
  }
}
