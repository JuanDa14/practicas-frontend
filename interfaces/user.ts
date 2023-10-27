import { Role } from '@/interfaces/role';

export interface BackendTokens {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

export interface User {
	_id: string;
	username: string;
	firstName: string;
	lastName: string;
	isActive: boolean;
	role: Role;
	avatar: string;
	address?: string;
	email?: string;
	phone_number?: string;
	gender?: string;
}
