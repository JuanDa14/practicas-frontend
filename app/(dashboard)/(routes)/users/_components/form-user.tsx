'use client';

import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Trash } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { axios } from '@/lib/axios';
import { User } from '@/interfaces/user';
import { Role } from '@/interfaces/role';

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/image-upload';
import { Icons } from '@/components/icons';
import { useModal } from '@/hooks/use-modal-store';

const createUserSchema = z.object({
	username: z.string({ required_error: 'El nombre de usuario es requerido' }).min(5, {
		message: 'El nombre de usuario debe tener al menos 5 caracteres.',
	}),
	password: z.string({ required_error: 'La contraseña es requerido' }).min(8, {
		message: 'La contraseña debe tener al menos 8 caracteres.',
	}),
	firstName: z.string({ required_error: 'El nombre es requerido' }).min(3, {
		message: 'El nombre debe tener al menos 3 caracteres.',
	}),
	lastName: z.string({ required_error: 'El apellido es requerido' }).min(3, {
		message: 'El apellido debe tener al menos 3 caracteres.',
	}),
	avatar: z.string().optional(),
	address: z.string().optional(),
	email: z.string({ required_error: 'El correo es requerido' }).email({
		message: 'El correo no es válido.',
	}),
	phone_number: z.string().optional(),
	gender: z.enum(['Masculino', 'Femenino', 'Otro']).optional(),
	role: z.string({ required_error: 'El rol es requerido' }).min(1, {
		message: 'El rol es requerido.',
	}),
	isActive: z.enum(['Activo', 'Inactivo']).optional(),
});

const updateUserSchema = createUserSchema.omit({ password: true }).extend({
	password: z.string().optional(),
});

interface FormUserProps {
	initialData?: User;
	roles: Role[];
}

export const FormUser = ({ initialData, roles }: FormUserProps) => {
	const router = useRouter();

	const { onOpen } = useModal();

	const form = useForm<z.infer<typeof createUserSchema>>({
		resolver: zodResolver(initialData ? updateUserSchema : createUserSchema),
		defaultValues: {
			username: initialData?.username || '',
			password: '',
			firstName: initialData?.firstName || '',
			lastName: initialData?.lastName || '',
			avatar: initialData?.avatar || '',
			address: initialData?.address || '',
			email: initialData?.email || '',
			phone_number: initialData?.phone_number || '',
			gender: (initialData?.gender as any) || 'Masculino',
			role: initialData?.role._id || roles[0]._id,
			isActive: initialData?.isActive ? 'Activo' : 'Inactivo',
		},
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (values: z.infer<typeof createUserSchema>) => {
		if (initialData) {
			try {
				await axios.patch(`/users/${initialData._id}`, {
					...values,
					isActive: values.isActive === 'Activo' ? true : false,
				});
				router.refresh();
				router.push('/users');
				toast.success('Usuario actualizado correctamente');
			} catch {
				toast.error('Error al actualizar el usuario');
			}
		} else {
			try {
				await axios.post('/users', {
					...values,
					isActive: values.isActive === 'Activo' ? true : false,
				});
				router.refresh();
				router.push('/users');
				toast.success('Usuario creado correctamente');
			} catch {
				toast.error('Error al crear el usuario');
			}
		}
	};

	return (
		<div className='w-full h-full p-6 space-y-2 mx-auto'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
					<div className='flex'>
						<div className='space-y-2 w-full'>
							<div className='flex justify-between'>
								<div className='text-lg font-medium'>
									<h3>Formulario de Usuario</h3>
									<p className='text-sm text-muted-foreground'>
										Complete todos los datos correctamente.
									</p>
								</div>
							</div>
						</div>
						<div className='flex gap-x-2 items-center'>
							<Button
								type='button'
								disabled={isSubmitting}
								variant={'outline'}
								onClick={() => router.back()}
							>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Atras
							</Button>
							{initialData && (
								<Button
									disabled={isSubmitting}
									onClick={() => onOpen('deleteUser', { user: initialData })}
									type='button'
								>
									<Trash className='h-4 w-4 mr-2' />
									Eliminar
								</Button>
							)}
						</div>
					</div>
					<Separator className='bg-primary/10' />
					<FormField
						name='avatar'
						render={({ field }) => (
							<FormItem className='flex flex-col items-center justify-center space-y-4'>
								<FormControl>
									<ImageUpload
										value={field.value}
										onChange={field.onChange}
										disabled={isSubmitting}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre de usuario</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder='nombre de usuario...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Contraseña{' '}
										{initialData && <span className='text-xs'>(opcional)</span>}
									</FormLabel>
									<FormControl>
										<Input
											type='password'
											disabled={isSubmitting}
											placeholder='contraseña...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='firstName'
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
						<FormField
							control={form.control}
							name='lastName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Apellidos</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder='apellidos...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Dirección <span className='text-xs'>(opcional)</span>
									</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder='direccion...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Correo electrónico</FormLabel>
									<FormControl>
										<Input
											type='email'
											disabled={isSubmitting}
											placeholder='correo...'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone_number'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Teléfono <span className='text-xs'>(opcional)</span>
									</FormLabel>
									<FormControl>
										<Input disabled={isSubmitting} placeholder='telefono...' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='gender'
							render={({ field }) => (
								<FormItem>
									<FormLabel>
										Género <span className='text-xs'>(opcional)</span>
									</FormLabel>
									<FormControl>
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
														placeholder='Seleccione...'
													/>
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{['Masculino', 'Femenino', 'Otro'].map((row) => (
													<SelectItem value={row} key={row}>
														{row}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name='role'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rol</FormLabel>
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
													placeholder='Seleccione...'
												/>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{roles.map((role) => (
												<SelectItem value={role._id} key={role._id}>
													{role.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{initialData && (
							<FormField
								name='isActive'
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
														placeholder='Seleccione...'
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

					<Button disabled={isSubmitting} type='submit' className='flex ml-auto'>
						{isSubmitting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
						Guardar usuario
					</Button>
				</form>
			</Form>
		</div>
	);
};
