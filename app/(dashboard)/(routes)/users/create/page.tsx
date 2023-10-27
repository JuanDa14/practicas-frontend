import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Role } from '@/interfaces/role';
import { FormUser } from '../_components/form-user';

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

async function CreateUserPage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const roles = await getRoles(session.backendTokens.accessToken);

	return <FormUser roles={roles} />;
}

export default CreateUserPage;
