'use client';

import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Grip, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TYPE_PRIORITY, Task, TaskWithProject } from '@/interfaces/task';
import toast from 'react-hot-toast';
import { axios } from '@/lib/axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface ChaptersListProps {
	items: TaskWithProject[];
}

export const DragDropTaskList = ({ items }: ChaptersListProps) => {
	const { data: session } = useSession();

	const router = useRouter();

	const [isMounted, setIsMounted] = useState(false);
	const [tasks, setTasks] = useState<TaskWithProject[]>([]);
	const [tasksCompleted, setTasksCompleted] = useState<TaskWithProject[]>([]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setTasks(items.filter((task) => !task.status));
	}, [items]);

	useEffect(() => {
		setTasksCompleted(items.filter((task) => task.status));
	}, [items]);

	const onDragEnd = async (result: DropResult) => {
		if (!result.destination) return;

		console.log(result);

		//Verificar si es una tarea completada o no
		const items = Array.from(tasks);
		const isCompleted = result.destination.droppableId === 'tasksCompleted';
		const taskId = result.draggableId;

		if (isCompleted) {
			//Agregar tarea a la lista de tareas completadas
			setTasksCompleted((prev) => [
				...prev,
				tasks.find((task) => task._id === taskId) as TaskWithProject,
			]);
			//Eliminar tarea de la lista de tareas
			setTasks((prev) => prev.filter((task) => task._id !== taskId));
		} else {
			//Agregar tarea a la lista de tareas
			setTasks((prev) => [
				...prev,
				tasksCompleted.find((task) => task._id === taskId) as TaskWithProject,
			]);
			//Eliminar tarea de la lista de tareas completadas
			setTasksCompleted((prev) => prev.filter((task) => task._id !== taskId));
		}

		//actualizar la tarea en la base de datos
		try {
			await axios.patch(
				`/tasks/change-status/${taskId}`,
				{ status: isCompleted, completed: isCompleted ? session?.user._id : null },
				{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
			);
			router.refresh();
			toast.success('Tarea actualizada');
		} catch {
			toast.error('No se pudo actualizar la tarea');
		}
	};

	if (!isMounted) {
		return null;
	}

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<div className='grid grid-cols-2 gap-8'>
				<div className='space-y-3'>
					<div>
						<h3 className='text-base font-medium capitalize'>Pendientes</h3>
						<p>
							<span className='text-sm text-muted-foreground italic line-clamp-1'>
								Estas son las tareas que aun no estan finalizadas.
							</span>
						</p>
					</div>
					<Separator />
					<Droppable droppableId='tasksInComplete'>
						{(provided) => (
							<div ref={provided.innerRef}>
								{tasks.map((task, index) => (
									<Draggable key={task._id} draggableId={task._id} index={index}>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={cn(
													'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm'
												)}
											>
												<div
													className={cn(
														'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition'
													)}
												>
													<Grip className='h-5 w-5' />
												</div>
												{task.name}
												<div className='ml-auto pr-2 flex items-center gap-x-2'>
													<Badge
														className={cn(
															task.priority === TYPE_PRIORITY.HIGH && 'bg-red-600',
															task.priority === TYPE_PRIORITY.MEDIUM &&
																'bg-yellow-600',
															task.priority === TYPE_PRIORITY.LOW && 'bg-green-600'
														)}
													>
														{task.priority === TYPE_PRIORITY.HIGH && 'Alta'}
														{task.priority === TYPE_PRIORITY.MEDIUM && 'Media'}
														{task.priority === TYPE_PRIORITY.LOW && 'Baja'}
													</Badge>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
				<div className='space-y-3'>
					<div>
						<h3 className='text-base font-medium capitalize'>Completadas</h3>
						<p>
							<span className='text-sm text-muted-foreground italic line-clamp-1'>
								Estas son las tareas que ya estan finalizadas.
							</span>
						</p>
					</div>
					<Separator />
					<Droppable droppableId='tasksCompleted'>
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{tasksCompleted.map((task, index) => (
									<Draggable key={task._id} draggableId={task._id} index={index}>
										{(provided) => (
											<div
												className={cn(
													'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm'
												)}
												ref={provided.innerRef}
												{...provided.draggableProps}
											>
												<div
													className={cn(
														'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition'
													)}
													{...provided.dragHandleProps}
												>
													<Grip className='h-5 w-5' />
												</div>
												{task.name}
												<div className='ml-auto pr-2 flex items-center gap-x-2'>
													<Badge
														className={cn(
															task.priority === TYPE_PRIORITY.HIGH && 'bg-red-600',
															task.priority === TYPE_PRIORITY.MEDIUM &&
																'bg-yellow-600',
															task.priority === TYPE_PRIORITY.LOW && 'bg-green-600'
														)}
													>
														{task.priority === TYPE_PRIORITY.HIGH && 'Alta'}
														{task.priority === TYPE_PRIORITY.MEDIUM && 'Media'}
														{task.priority === TYPE_PRIORITY.LOW && 'Baja'}
													</Badge>
												</div>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</div>
			</div>
		</DragDropContext>
	);
};
