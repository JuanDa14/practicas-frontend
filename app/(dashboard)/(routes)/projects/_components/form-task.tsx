'use client';

import { IconBadge } from '@/components/icon-badge';
import { Button } from '@/components/ui/button';
import { FileArchive } from 'lucide-react';
import { Tasks } from './tasks';
import { Project } from '@/interfaces/project';
import { useModal } from '@/hooks/use-modal-store';

interface FormTaskProps {
	project: Project;
}

export const FormTask = ({ project }: FormTaskProps) => {
	const { onOpen } = useModal();

	return (
		<div className='w-full space-y-6'>
			<div className='w-full flex items-center gap-3 justify-between'>
				<div className='flex items-center gap-3'>
					<IconBadge icon={FileArchive} />
					<h3 className='text-lg font-medium'>Tareas</h3>
				</div>
				<Button size={'sm'} type='button' onClick={() => onOpen('createTask', { project })}>
					Crear
				</Button>
			</div>
			<Tasks tasks={project.tasks} />
		</div>
	);
};
