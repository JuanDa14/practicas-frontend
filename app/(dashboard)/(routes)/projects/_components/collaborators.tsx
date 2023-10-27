'use client';

import { Project } from '@/interfaces/project';
import { cn } from '@/lib/utils';
import { ListCollaborator } from './list-collaborator';

interface CollaboratorsProps {
	collaborators: Project['collaborators'];
	projectId: string;
}

export const Collaborators = ({ collaborators, projectId }: CollaboratorsProps) => {
	return (
		<div className='flex items-center gap-2'>
			{collaborators.length === 0 ? (
				<p className={cn('flex-1 text-sm', collaborators.length === 0 && 'italic')}>
					El proyecto no tiene colaboradores
				</p>
			) : (
				<ListCollaborator collaborators={collaborators} projectId={projectId} />
			)}
		</div>
	);
};
