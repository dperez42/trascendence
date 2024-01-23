declare module 'passport-42' {
	import { Strategy as OAuth2Strategy } from 'passport-oauth2';
  
	export class Strategy extends OAuth2Strategy {
	  constructor(options: any, verify: any);
	}
  }