import { getServerSession } from 'next-auth';
import { FormRol } from '../_components/form-rol';
import { Role } from '@/interfaces/role';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

interface RoleIdPageProps {
	params: {
		roleId: string;
	};
}

async function getRole(roleId: string, access_token: string): Promise<Role> {
	const resp = await fetch(`${process.env.API_URL}/roles/${roleId}`, {
		cache: 'no-cache',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!resp.ok) {
		throw new Error('Error al obtener el rol');
	}

	const data = await resp.json();

	return data;
}

const RoleIdPage = async ({ params }: RoleIdPageProps) => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const rol = await getRole(params.roleId, session.backendTokens.accessToken);

	return <FormRol initialData={rol} />;
};

export default RoleIdPage;
