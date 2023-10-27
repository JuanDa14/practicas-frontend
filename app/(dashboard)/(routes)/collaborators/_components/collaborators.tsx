'use client';

import { cn } from '@/lib/utils';
import { ListCollaborator } from './list-collaborators';
import { Project } from '@/interfaces/project';

interface TasksProps {
	projects: Project[];
}

export const Collaborators = ({ projects }: TasksProps) => {
	return (
		<div className='flex items-center gap-2'>
			{projects.length === 0 ? (
				<p className={cn('flex-1 text-sm italic text-center text-muted-foreground')}>
					No tienes colaboradores agregados
				</p>
			) : (
				<ListCollaborator projects={projects} />
			)}
		</div>
	);
};
