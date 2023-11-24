'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { ProjectWithCreator } from '@/interfaces/project';
import { axios } from '@/lib/axios';
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface ProjectButtonsProps {
	project: ProjectWithCreator;
}

export const ProjectButtons = ({ project }: ProjectButtonsProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const { data: session } = useSession();

	const isValidFinishedProject =
		!(project.client.length > 0) ||
		!(project.tasks.length > 0) ||
		!(project.collaborators.length > 0);

	const { onOpen } = useModal();
	const { onOpen: onOpenConfetti } = useConfettiStore();
	const router = useRouter();

	const onFinishProject = async () => {
		try {
			setIsLoading(true);
			await axios.patch(
				`/projects/${project._id}`,
				{ isFinished: true },
				{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
			);
			toast.success('Proyecto terminado');
			onOpenConfetti();
			router.refresh();
			router.push('/projects');
		} catch {
			toast.error('No se pudo terminar el proyecto');
		} finally {
			setIsLoading(false);
		}
	};

	const onRestoreProject = async () => {
		try {
			setIsLoading(true);
			await axios.patch(
				`/projects/${project._id}`,
				{ isFinished: false },
				{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
			);
			toast.success('Proyecto restaurado');
			router.refresh();
			router.push('/projects');
		} catch {
			toast.error('No se pudo restaurar el proyecto');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center gap-2'>
			{project.isFinished && (
				<Button
					variant={'secondary'}
					disabled={isLoading}
					onClick={onRestoreProject}
					type='button'
				>
					Restaurar proyecto
				</Button>
			)}
			{!project.isFinished && (
				<Button
					variant={'outline'}
					disabled={isLoading || isValidFinishedProject}
					onClick={onFinishProject}
					type='button'
				>
					Finalizar proyecto
				</Button>
			)}
			<Button
				size={'icon'}
				disabled={isLoading}
				onClick={() => onOpen('deleteProject', { project })}
			>
				<Trash2 className='w-4 h-4' />
			</Button>
			<Button disabled={isLoading} onClick={() => router.push('/projects')}>
				<ArrowLeft className='h-4 w-4 mr-2' />
				Atras
			</Button>
		</div>
	);
};
