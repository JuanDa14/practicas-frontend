import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { Role } from '@/interfaces/role';
import { authOptions } from '@/lib/auth-options';

import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

export const metadata: Metadata = {
	title: 'Roles',
	description: 'Lista de roles de la constructora WVS',
};

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

async function RolePage() {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const roles = await getRoles(session.backendTokens.accessToken);

	return <DataTable columns={columns} data={roles} />;
}

export default RolePage;
