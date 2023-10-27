'use client';

import { cn } from '@/lib/utils';
import { ListTask } from './list-task';
import { Task } from '@/interfaces/task';

interface TasksProps {
	tasks: Task[];
}

export const Tasks = ({ tasks }: TasksProps) => {
	return (
		<div className='flex items-center gap-2'>
			{tasks.length === 0 ? (
				<p className={cn('flex-1 text-sm', tasks.length === 0 && 'italic')}>
					El proyecto no tiene tareas creadas
				</p>
			) : (
				<ListTask tasks={tasks} />
			)}
		</div>
	);
};
