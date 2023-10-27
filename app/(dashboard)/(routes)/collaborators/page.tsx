import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Separator } from '@/components/ui/separator';
import { Project } from '@/interfaces/project';
import { Collaborators } from './_components/collaborators';

export const metadata: Metadata = {
	title: 'Colaboradores',
	description: 'Colaboradores de los proyectos de la constructora WVS',
};

async function getCollaborators(access_token: string): Promise<Project[]> {
	const res = await fetch(`${process.env.API_URL}/collaborators`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		throw new Error('Problem fetching collaborators');
	}

	const data = await res.json();

	return data;
}

const CollaboratorsPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const collaborators = await getCollaborators(session.backendTokens.accessToken);

	return (
		<div className='flex-1 flex flex-col p-6 space-y-4'>
			<div className='flex justify-between items-center gap-5'>
				<div>
					<h2 className='text-lg font-medium'>Colaboradores</h2>
					<p className='text-sm text-muted-foreground'>
						Estos son los colaboradores por proyecto.
					</p>
				</div>
			</div>
			<Separator />
			<Collaborators projects={collaborators} />
		</div>
	);
};

export default CollaboratorsPage;
