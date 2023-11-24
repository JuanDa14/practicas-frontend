'use client';

import { useSession } from 'next-auth/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Project } from '@/interfaces/project';

interface ListCollaboratorProps {
	projects: Project[];
}

export const ListCollaborator = ({ projects }: ListCollaboratorProps) => {
	const { data: session } = useSession();

	return (
		<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
			{projects.map((project) => (
				<Card key={project._id}>
					<CardHeader className='flex gap-2'>
						<CardTitle className='text-base line-clamp-2'>{project.name}</CardTitle>
						<Badge className='w-fit'>
							{session?.user._id === project.creator ? 'Director' : 'Colaborador'}
						</Badge>
					</CardHeader>
					<CardContent>
						{project.collaborators.length === 0 ? (
							<div>
								<p className='text-sm italic'>No hay colaboradores en el proyecto</p>
							</div>
						) : (
							<div>
								{project.collaborators.map((collaborator, index) => (
									<span className='text-sm' key={collaborator._id}>
										{collaborator.firstName} {collaborator.lastName}
										{project.collaborators.length - 1 === index ? '.' : ', '}
									</span>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
};
