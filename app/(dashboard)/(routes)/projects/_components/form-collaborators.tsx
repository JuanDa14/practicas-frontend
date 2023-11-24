'use client';

import { IconBadge } from '@/components/icon-badge';
import { Button } from '@/components/ui/button';
import { Users2 } from 'lucide-react';
import { Collaborators } from './collaborators';
import { ProjectWithCreator } from '@/interfaces/project';
import { useModal } from '@/hooks/use-modal-store';

interface FormCollaboratorsProps {
	project: ProjectWithCreator;
}

export const FormCollaborators = ({ project }: FormCollaboratorsProps) => {
	const { onOpen } = useModal();

	return (
		<div className='space-y-4'>
			<div className='w-full flex items-center gap-3 justify-between'>
				<div className='flex items-center gap-3'>
					<IconBadge icon={Users2} />
					<h3 className='text-lg font-medium'>Colaboradores</h3>
				</div>
				<Button
					size={'sm'}
					type='button'
					onClick={() => onOpen('addCollaborators', { project })}
				>
					Agregar
				</Button>
			</div>
			<Collaborators collaborators={project.collaborators} projectId={project._id} />
		</div>
	);
};
