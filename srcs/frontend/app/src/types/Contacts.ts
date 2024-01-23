export interface Contacts {
	id: string;
	login: string;
	name: string;
	blocked: boolean;
	status: boolean;
	password?: string;
	images: [];
	type: string;
}