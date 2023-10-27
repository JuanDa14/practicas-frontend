'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { Project } from '@/interfaces/project';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { axios } from '@/lib/axios';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface ProjectButtonsProps {
	project: Project;
}

export const ProjectButtons = ({ project }: ProjectButtonsProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const { data: session } = useSession();

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
					variant={'secondary'}
					disabled={isLoading}
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
