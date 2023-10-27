'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { axios } from '@/lib/axios';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
// import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Role } from '@/interfaces/role';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useModal } from '@/hooks/use-modal-store';

const createRolSchema = z.object({
	name: z.string({ required_error: 'El nombre es requerido' }).min(3, {
		message: 'El nombre debe tener al menos 3 caracteres.',
	}),
	state: z.enum(['Activo', 'Inactivo']),
});

interface FormRolProps {
	initialData?: Role;
}

export const FormRol = ({ initialData }: FormRolProps) => {
	const router = useRouter();

	const { onOpen } = useModal();

	const form = useForm<z.infer<typeof createRolSchema>>({
		resolver: zodResolver(createRolSchema),
		defaultValues: {
			name: initialData?.name || '',
			state: initialData?.state ? 'Activo' : 'Inactivo' || 'Activo',
		},
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (values: z.infer<typeof createRolSchema>) => {
		if (initialData) {
			try {
				await axios.patch(`/roles/${initialData._id}`, {
					...values,
					state: values.state === 'Activo' ? true : false,
				});
				toast.success('Rol actualizado correctamente');
				router.refresh();
				router.push('/roles');
			} catch {
				toast.error('Error al actualizar el rol');
			}
		} else {
			try {
				await axios.post('/roles/', values);
				toast.success('Rol creado correctamente');
				router.refresh();
				router.push('/roles');
			} catch {
				toast.error('Error al crear el rol');
			}
		}
	};

	return (
		<div className='h-full w-full p-6 space-y-2  mx-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<div className='flex items-center justify-between space-y-2'>
						<div className='flex justify-between'>
							<div className='text-lg font-medium'>
								<h3>Formulario</h3>
								<p className='text-sm text-muted-foreground'>
									Complete todos los datos correctamente.
								</p>
							</div>
						</div>
						<div className='flex gap-x-2 items-center'>
							<Button
								type='button'
								variant={'outline'}
								disabled={isSubmitting}
								onClick={() => router.back()}
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Atras
							</Button>
							{initialData && (
								<Button
									type='button'
									disabled={isSubmitting}
									onClick={() => onOpen('deleteRole', { role: initialData })}
								>
									<Trash className='h-4 w-4 mr-2' />
									Eliminar
								</Button>
							)}
						</div>
					</div>
					<Separator className='bg-primary/10' />
					<div className='grid grid-cols-1 gap-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} placeholder='nombre...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{initialData && (
							<FormField
								name='state'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<Select
											disabled={isSubmitting}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='bg-background'>
													<SelectValue
														defaultValue={field.value}
														placeholder='Seleccione un estado'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{['Activo', 'Inactivo'].map((row) => (
													<SelectItem value={row} key={row}>
														{row}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}
					</div>

					<Button className='flex ml-auto' disabled={isSubmitting} type='submit'>
						{isSubmitting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
						Guardar
					</Button>
				</form>
			</Form>
		</div>
	);
};
