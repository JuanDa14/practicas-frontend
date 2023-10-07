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
import { axiosBaseUrl } from '@/lib/axios';

const SettingsFormSchema = z.object({
	username: z.string().min(1, {
		message: 'El nombre de usuario debe tener al menos 1 caracteres.',
	}),
	firstName: z.string().min(1, {
		message: 'El nombre debe tener al menos 1 caracteres.',
	}),
	lastName: z.string().min(1, {
		message: 'El apellido debe tener al menos 1 caracteres.',
	}),
	avatar: z.string().min(1, { message: 'La imagen es requerida.' }),
	email: z.string().email({ message: 'El correo electrónico no es válido.' }),
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
			firstName: user.firstName,
			lastName: user.lastName,
			username: user.username,
			avatar: user.avatar,
			email: user.email,
		},
	});

	const { isSubmitting } = form.formState;

	async function onSubmit(values: SettingFormValues) {
		try {
			const { data } = await axiosBaseUrl.patch<User>(`/users/${session?.user._id}`, values);

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
						name='firstName'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombres</FormLabel>
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
									<Input disabled={isSubmitting} placeholder='apellido...' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre de usuario</FormLabel>
								<FormControl>
									<Input disabled={isSubmitting} placeholder='usuario...' {...field} />
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
								<FormLabel>Correo</FormLabel>
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
				</div>
				<Button disabled={isSubmitting} type='submit' className='flex ml-auto'>
					{isSubmitting && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
					Actualizar perfil
				</Button>
			</form>
		</Form>
	);
}
