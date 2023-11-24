import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Separator } from '@/components/ui/separator';
import { ProjectWithCreator } from '@/interfaces/project';

import { FormProject } from '../_components/form-project';
import { FormClient } from '../_components/form-client';
import { FormCollaborators } from '../_components/form-collaborators';
import { FormTask } from '../_components/form-task';
import { ProjectButtons } from '../_components/project-buttons';

async function getProject(id: string, access_token: string): Promise<ProjectWithCreator> {
	const res = await fetch(`${process.env.API_URL}/projects/${id}`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
		cache: 'no-cache',
	});

	if (!res.ok) {
		throw new Error('Ocurrio un error al obtener el proyecto');
	}

	const data = await res.json();
	return data;
}

interface ProjectIdPageProps {
	params: {
		projectId: string;
	};
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const project = await getProject(params.projectId, session.backendTokens.accessToken);

	return (
		<div className='p-6 space-y-4'>
			<div className='flex items-center justify-between gap-4'>
				<div>
					<h3 className='text-lg font-medium'>Formulario de Proyecto</h3>
					<p className='text-sm text-muted-foreground'>
						Complete todos los campos correctamente.
					</p>
				</div>
				<ProjectButtons project={project} />
			</div>
			<Separator />
			<div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
				{/* Proyecto */}
				<FormProject project={project} />
				<div className='space-y-8'>
					{/* Cliente */}
					<FormClient project={project} />
					{/* Tareas */}
					<FormTask project={project} />
					{/* Colaboradores */}
					<FormCollaborators project={project} />
				</div>
			</div>
		</div>
	);
};

export default ProjectIdPage;
