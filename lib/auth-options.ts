import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { User } from '@/interfaces/user';

declare module 'next-auth' {
	interface Session {
		user: User;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		user: User;
	}
}

export const options: NextAuthOptions = {
	session: { strategy: 'jwt' },
	providers: [
		CredentialsProvider({
			id: 'credentials',
			name: 'Credentials',
			type: 'credentials',
			credentials: {
				username: {},
				password: {},
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null;

				const payload = {
					username: credentials.username,
					password: credentials.password,
				};

				const res = await fetch(`${process.env.API_URL}/auth`, {
					method: 'POST',
					body: JSON.stringify(payload),
					headers: { 'Content-Type': 'application/json' },
				});

				const user = await res.json();

				if (!res.ok) throw new Error(user.message);

				if (res.ok && user) {
					return user;
				}

				return null;
			},
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		jwt: async ({ token, user, trigger, session }) => {
			if (trigger === 'update' && session) {
				if (session.accessToken && session.refreshToken) {
					return {
						...token,
						user: {
							...session.user,
						},
					};
				}
				return {
					...token,
					user: {
						...session.user,
					},
				};
			}
			if (user) {
				return {
					...token,
					...user,
				};
			}

			return token;
		},
		session: async ({ session, token }) => {
			session.user = {
				_id: token.user._id,
				username: token.user.username,
				firstName: token.user.firstName,
				lastName: token.user.lastName,
				isActive: token.user.isActive,
				role: token.user.role,
			};

			return session;
		},
	},
	pages: { signIn: '/login', error: '/login' },
};
