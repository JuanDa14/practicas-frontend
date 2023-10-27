'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { TYPE_PRIORITY, TaskWithProject } from '@/interfaces/task';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CardTaskProps {
	task: TaskWithProject;
}

export const CardTask = ({ task }: CardTaskProps) => {
	const { data: session } = useSession();

	const isOwner = task.project.creator._id === session?.user?._id || false;

	const router = useRouter();

	const onNavigate = () => {
		router.push(`/projects/${task._id}`);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className='line-clamp-1 text-xl'>{task.name}</CardTitle>
				<CardDescription className='line-clamp-2'>{task.description}</CardDescription>
				<Badge
					variant={'outline'}
					className={cn('text-xs w-fit', !isOwner && 'bg-muted-foreground text-white')}
				>
					Director
				</Badge>
			</CardHeader>
			<CardContent className='space-y-1'>
				<div className='flex items-center gap-2'>
					<span className='text-xs text-muted-foreground'>Proyecto:</span>
					<span className='text-xs text-muted-foreground'>{task.project.name}</span>
				</div>
				<div className='flex gap-2 items-center'>
					<span className='text-xs text-muted-foreground'>Prioridad:</span>
					<Badge
						variant={'outline'}
						className={cn(
							'text-xs text-white font-normal',
							task.priority === TYPE_PRIORITY.LOW && 'bg-emerald-600',
							task.priority === TYPE_PRIORITY.MEDIUM && 'bg-yellow-600',
							task.priority === TYPE_PRIORITY.HIGH && 'bg-red-600'
						)}
					>
						{task.priority === TYPE_PRIORITY.LOW && 'Baja'}
						{task.priority === TYPE_PRIORITY.MEDIUM && 'Media'}
						{task.priority === TYPE_PRIORITY.HIGH && 'Alta'}
					</Badge>
				</div>
				<div className='flex items-center gap-2'>
					<span className='text-xs text-muted-foreground'>Fecha l&iacute;mite:</span>
					<span className='text-xs text-muted-foreground'>
						{format(new Date(task.deadline), 'dd/MM/yyyy')}
					</span>
				</div>
			</CardContent>
		</Card>
	);
};
