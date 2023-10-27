'use client';

import { z } from 'zod';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { InputSearch } from '../input-search';
import toast from 'react-hot-toast';
import { axios } from '@/lib/axios';
import { useEffect, useState } from 'react';
import { User } from '@/interfaces/user';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';

const formSchema = z.object({
	username: z.string({ required_error: 'El nombre es requerido' }).optional(),
	projectId: z.string({ required_error: 'El proyecto es requerido' }).min(1, {
		message: 'El proyecto debe tener al menos 1 caracter.',
	}),
});

export const AddCollaboratorModal = () => {
	const { data: session } = useSession();

	const router = useRouter();

	const { isOpen, onClose, type, data } = useModal();

	const { project } = data;

	const isModalOpen = isOpen && type === 'addCollaborators';

	const [collaborators, setCollaborators] = useState<User[]>([]);

	const [isSearching, setIsSearching] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			projectId: project?._id || '',
		},
	});

	const { isSubmitting } = form.formState;

	useEffect(() => {
		if (project) {
			form.setValue('projectId', project._id);
		}
	}, [form, project]);

	const onReset = () => {
		onClose();
		form.reset();
		setCollaborators([]);
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const promises = collaborators.map(async (collaborator) => {
			try {
				await axios.post(
					'/collaborators/add',
					{ username: collaborator.username, projectId: values.projectId },
					{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
				);
				return true;
			} catch (error) {
				throw error;
			}
		});
		try {
			await Promise.all(promises);
			toast.success('colaboradores agregados correctamente');
			router.refresh();
		} catch {
			toast.error('Error al agregar colaboradores');
		} finally {
			onReset();
		}
	};

	const onSearch = async () => {
		setIsSearching(true);

		if (!form.getValues('username')) {
			setIsSearching(false);
			return toast.error('El nombre de usuario es requerido');
		}

		const isExistCollaboratorInProjectDB = project?.collaborators.some(
			(collaborator) => collaborator.username === form.getValues('username')
		);

		if (isExistCollaboratorInProjectDB) {
			setIsSearching(false);
			return toast.error('El colaborador ya esta agregado');
		}

		try {
			const { data } = await axios.post('/collaborators', {
				username: form.getValues('username'),
			});

			const isCreator = data.username === session?.user?.username;

			if (isCreator) {
				return toast.error('No puedes ser colaborador de tu propio proyecto');
			}

			const isExistCollaborator = collaborators.some(
				(collaborator) => collaborator.username === data.username
			);

			if (isExistCollaborator) {
				return toast.error('El colaborador ya esta agregado');
			}

			toast.success('Usuario encontrado');
			setCollaborators((prev) => [...prev, data]);
		} catch {
			toast.error('Colaborador no encontrado');
		} finally {
			setIsSearching(false);
		}
	};

	return (
		<Dialog onOpenChange={onReset} open={isModalOpen}>
			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<div>
							<h3 className='text-lg font-medium'>Formulario colaborador</h3>
							<p className='text-sm text-muted-foreground'>
								Busque el colaborador por su nombre de usuario.
							</p>
						</div>
						<Separator />
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<InputSearch
											isSubmitting={isSubmitting}
											isSearching={isSearching}
											onChange={field.onChange}
											value={field.value as string}
											onSearch={onSearch}
											isValid={!form.getValues('username')}
											placeholder='Buscar colaborador...'
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						{collaborators.length > 0 && (
							<div className='mt-6 space-y-3'>
								<h3 className='text-sm font-medium'>Lista de Colaboradores</h3>
								<Separator />
								{collaborators.map((collaborator) => (
									<div
										key={collaborator._id}
										className='flex items-center justify-between space-x-3'
									>
										<div className='flex items-center space-x-2'>
											<Image
												src={collaborator.avatar || '/placeholder.svg'}
												alt={collaborator.username}
												className='w-8 h-8 rounded-full'
												width={32}
												height={32}
											/>
											<span>{collaborator.username}</span>
										</div>
										<Button
											size={'icon'}
											variant='secondary'
											onClick={() =>
												setCollaborators((prev) =>
													prev.filter(
														(item) => item.username !== collaborator.username
													)
												)
											}
										>
											<Trash className='w-4 h-4' />
										</Button>
									</div>
								))}
							</div>
						)}
						<Button
							disabled={isSubmitting || collaborators.length === 0}
							type='submit'
							className='w-full'
						>
							Guardar
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
