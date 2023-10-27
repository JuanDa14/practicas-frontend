'use client';

import { Project } from '@/interfaces/project';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ListCollaboratorProps {
	projects: Project[];
}

export const ListCollaborator = ({ projects }: ListCollaboratorProps) => {
	return (
		<div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
			{projects.map((project) => (
				<Card key={project._id}>
					<CardHeader className='flex gap-2'>
						<CardTitle className='text-base line-clamp-2'>{project.name}</CardTitle>
					</CardHeader>
					<CardContent>
						{project.collaborators.length === 0 ? (
							<div>
								<p className='text-sm italic'>No hay colaboradores en el proyecto</p>
							</div>
						) : (
							<div>
								{project.collaborators.map((collaborator) => (
									<p className='text-sm' key={collaborator._id}>
										{collaborator.firstName} {collaborator.lastName}{' '}
									</p>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
};
