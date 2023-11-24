import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ProjectWithCreator } from '@/interfaces/project';
import { authOptions } from '@/lib/auth-options';
import { DataTable } from './_components/data-table';
import { columns } from './_components/columns';

export const metadata: Metadata = {
	title: 'Proyectos',
	description: 'Lista de proyectos de la constructora WVS',
};

async function getProjects(access_token: string): Promise<ProjectWithCreator[]> {
	const res = await fetch(`${process.env.API_URL}/projects`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		throw new Error('Problem fetching projects');
	}

	const data = await res.json();

	return data;
}

const ProjectsPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const projects = await getProjects(session.backendTokens.accessToken);

	return <DataTable columns={columns} data={projects} />;
};

export default ProjectsPage;
