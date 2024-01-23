export interface User {
	id: string;
	email: string;
	login: string;
	images: string;
	password: string;
	name: string;
	lastName: string;
	isActive: boolean;
	roles: string[];
	twoFASecret: string;
}