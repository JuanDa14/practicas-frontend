import { User } from '@/interfaces/user';
import { Role } from '@/interfaces/role';

import { FormUser } from '../_components/form-user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

interface UserIdPageProps {
	params: {
		userId: string;
	};
}

async function getUser(userId: string, access_token: string): Promise<User> {
	const resp = await fetch(`${process.env.API_URL}/users/${userId}`, {
		cache: 'no-cache',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!resp.ok) {
		throw new Error('Error al obtener los usuarios');
	}

	const data = await resp.json();

	return data;
}

async function getRoles(access_token: string): Promise<Role[]> {
	const resp = await fetch(`${process.env.API_URL}/roles`, {
		cache: 'no-cache',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!resp.ok) {
		throw new Error('Error al obtener los roles');
	}

	const data = await resp.json();

	return data;
}

async function Page({ params }: UserIdPageProps) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const [user, roles] = await Promise.all([
		getUser(params.userId, session.backendTokens.accessToken),
		getRoles(session.backendTokens.accessToken),
	]);

	return <FormUser initialData={user} roles={roles} />;
}

export default Page;
