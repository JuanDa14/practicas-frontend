import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { User } from '@/interfaces/user';
import { authOptions } from '@/lib/auth-options';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

export const metadata: Metadata = {
	title: 'Usuarios',
	description: 'Lista de usuarios registrados en el sistema',
};

async function getUsers(access_token: string): Promise<User[]> {
	const resp = await fetch(`${process.env.API_URL}/users`, {
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

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const [users] = await Promise.all([getUsers(session.backendTokens.accessToken)]);

	return <DataTable columns={columns} data={users} />;
}
