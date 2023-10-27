'use client';

import React from 'react';
import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { axios } from '@/lib/axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModal } from '@/hooks/use-modal-store';
import { TYPE_PRIORITY } from '@/interfaces/task';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
	name: z
		.string({ required_error: 'El nombre es requerido' })
		.min(3, 'El nombre debe tener al menos 3 caracteres'),
	description: z
		.string({ required_error: 'La descripción es requerida' })
		.min(10, 'La descripción debe tener al menos 10 caracteres'),
	deadline: z.date({ required_error: 'La fecha límite es requerida' }),
	priority: z.nativeEnum(TYPE_PRIORITY, {
		required_error: 'La prioridad es requerida',
	}),
	project: z.string({ required_error: 'El proyecto es requerido' }).min(1, {
		message: 'El proyecto debe tener al menos 1 caracter.',
	}),
});

export const CreateTaskModal = () => {
	const router = useRouter();

	const { data: session } = useSession();

	const { isOpen, type, onClose, data } = useModal();

	const { project, task } = data;

	const isModalOpen = isOpen && type === 'createTask';

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: task?.name || '',
			description: task?.description || '',
			deadline: new Date(task?.deadline || Date.now()),
			priority: task?.priority || TYPE_PRIORITY.LOW,
			project: task?.project || project?._id,
		},
	});

	useEffect(() => {
		if (project) {
			form.setValue('project', project._id);
		}
	}, [form, project]);

	useEffect(() => {
		if (task) {
			form.setValue('name', task.name);
			form.setValue('description', task.description);
			form.setValue('deadline', new Date(task.deadline));
			form.setValue('priority', task.priority);
			form.setValue('project', task.project);
		}
	}, [form, task]);

	const { isSubmitting } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (task) {
			try {
				await axios.patch(`/tasks/${task._id}`, values, {
					headers: {
						Authorization: `Bearer ${session?.backendTokens.accessToken}`,
					},
				});
				toast.success('Tarea actualizada correctamente');
				router.refresh();
			} catch {
				toast.error('Ocurrió un error al actualizar la tarea');
			} finally {
				onReset();
			}
		} else {
			try {
				await axios.post('/tasks', values, {
					headers: {
						Authorization: `Bearer ${session?.backendTokens.accessToken}`,
					},
				});
				toast.success('Tarea creada correctamente');
				router.refresh();
			} catch {
				toast.error('Ocurrió un error al crear la tarea');
			} finally {
				onReset();
			}
		}
	};

	const onReset = () => {
		onClose();
		form.reset();
	};

	return (
		<Dialog onOpenChange={onReset} modal open={isModalOpen}>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<div>
							<h3 className='text-lg font-medium'>Formulario nueva tarea</h3>
							<p className='text-sm text-muted-foreground'>
								Complete el formulario correctamente.
							</p>
						</div>
						<Separator />
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Ingrese nombre de la tarea...'
											disabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder='Ingrese nombre de la tarea...'
											disabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='deadline'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha límite</FormLabel>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											isDisabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='priority'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Prioridad</FormLabel>
									<Select
										disabled={isSubmitting}
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Seleccione...' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(TYPE_PRIORITY).map((priority) => (
												<SelectItem key={priority} value={priority}>
													{priority === TYPE_PRIORITY.LOW && 'Baja'}
													{priority === TYPE_PRIORITY.MEDIUM && 'Media'}
													{priority === TYPE_PRIORITY.HIGH && 'Alta'}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting}>Guardar</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
