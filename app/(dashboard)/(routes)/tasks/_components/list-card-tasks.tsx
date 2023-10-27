'use client';

import { useState, useEffect } from 'react';
import { TaskWithProject } from '@/interfaces/task';
import { DragDropTaskList } from './drag-and-drop';
import { Project } from '@/interfaces/project';
import { cn } from '@/lib/utils';

interface ListCardTasksProps {
	tasks: TaskWithProject[];
}

export const ListCardTasks = ({ tasks }: ListCardTasksProps) => {
	const [filteredTasks, setFilteredTasks] = useState<TaskWithProject[]>([]);
	const [isSelectedProject, setIsSelectedProject] = useState<string>('');
	const [projects, setProjects] = useState<Project[]>([]);
	const isEmpty = tasks.length === 0;

	useEffect(() => {
		const uniqueProjects = tasks.reduce((acc, task) => {
			if (!acc.some((project) => project._id === task.project._id)) {
				return [...acc, task.project];
			}
			return acc;
		}, [] as Project[]);

		setProjects(uniqueProjects);
	}, [tasks]);

	const handleFilterTasks = (projectId: string) => {
		setIsSelectedProject(projectId);
		setFilteredTasks(tasks.filter((task) => task.project._id === projectId));
	};

	if (isEmpty) {
		return (
			<div className='flex-1 flex flex-col items-center justify-center'>
				<p className='text-sm text-muted-foreground italic'>No hay tareas en tu cuenta.</p>
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3 overflow-x-auto'>
				{projects.map((project) => (
					<div
						onClick={() => handleFilterTasks(project._id)}
						className={cn(
							'border rounded p-2 cursor-pointer',
							isSelectedProject === project._id &&
								'border-sky-600 bg-sky-100/50 text-sky-600'
						)}
						key={project._id}
					>
						<p className='text-sm font-medium capitalize line-clamp-1'>{project.name}</p>
					</div>
				))}
			</div>
			{filteredTasks.length > 0 ? (
				<DragDropTaskList items={filteredTasks} />
			) : (
				<div className='flex items-center justify-center'>
					<p className='italic'>Selecciona un proyecto para ver las tareas asociadas.</p>
				</div>
			)}
		</div>
	);
};
