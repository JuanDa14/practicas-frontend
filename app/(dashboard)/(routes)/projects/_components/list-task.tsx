'use client';

import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { Task } from '@/interfaces/task';
import { Pencil, Trash } from 'lucide-react';
import { axios } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ListTaskProps {
	tasks: Task[];
}

export const ListTask = ({ tasks }: ListTaskProps) => {
	const { onOpen } = useModal();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const { data: session } = useSession();

	const onDelete = async (taskId: string) => {
		try {
			setIsLoading(true);
			await axios.delete(`/tasks/${taskId}`, {
				headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` },
			});
			router.refresh();
			toast.success('Tarea eliminada');
		} catch {
			toast.error('No se pudo eliminar la tarea');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='w-full flex flex-col gap-5'>
			{tasks.map((task) => (
				<div key={task._id} className='w-full flex items-center justify-between'>
					<div className='flex gap-2'>
						<span className='text-sm'>{task.name}</span>
					</div>
					<div className='flex gap-3 items-center'>
						<Button
							disabled={isLoading}
							variant={'outline'}
							size={'icon'}
							onClick={() => onOpen('createTask', { task })}
						>
							<Pencil className='w-4 h-4' />
						</Button>
						<Button
							disabled={isLoading}
							variant={'outline'}
							size={'icon'}
							type='button'
							onClick={() => onDelete(task._id)}
						>
							<Trash className='w-4 h-4' />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};
