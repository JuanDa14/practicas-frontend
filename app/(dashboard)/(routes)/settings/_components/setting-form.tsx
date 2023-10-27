'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

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
import { ImageUpload } from '@/components/image-upload';
import { Icons } from '@/components/icons';
import { User } from '@/interfaces/user';
import { axios } from '@/lib/axios';
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Select,
} from '@/components/ui/select';

const SettingsFormSchema = z.object({
	username: z.string({ required_error: 'El nombre de usuario es requerido' }).min(5, {
		message: 'El nombre de usuario debe tener al menos 5 caracteres.',
	}),
	password: z.string({ required_error: 'La contraseña es requerido' }).optional(),
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
});

type SettingFormValues = z.infer<typeof SettingsFormSchema>;

interface SettingFromProps {
	user: User;
}

export function FormSetting({ user }: SettingFromProps) {
	const router = useRouter();

	const { update, data: session } = useSession();

	const form = useForm<SettingFormValues>({
		resolver: zodResolver(SettingsFormSchema),
		defaultValues: {
			username: user.username,
			password: '',
			firstName: user.firstName,
			lastName: user.lastName,
			avatar: user.avatar || '/placeholder.svg',
			address: user.address || '',
			email: user.email,
			phone_number: user.phone_number || '',
			gender: (user.gender as any) || '',
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: SettingFormValues) {
		try {
			const { data } = await axios.patch<User>(`/users/${session?.user._id}`, values);

			await update({ user: { ...data } });

			router.refresh();
			router.push('/');

			toast.success('Perfil actualizado correctamente.');
		} catch {
			toast.error('Ocurrió un error al actualizar el perfil.');
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
				<FormField
					name='avatar'
					render={({ field }) => (
						<FormItem className='mb-10'>
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
				<div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
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
									Contraseña <span className='text-xs'>(opcional)</span>
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
									<Input disabled={isSubmitting} placeholder='apellidos...' {...field} />
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
									<Input disabled={isSubmitting} placeholder='direccion...' {...field} />
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
				</div>
				<Button disabled={isSubmitting} type='submit' className='flex ml-auto'>
					{isSubmitting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
					Actualizar
				</Button>
			</form>
		</Form>
	);
}
