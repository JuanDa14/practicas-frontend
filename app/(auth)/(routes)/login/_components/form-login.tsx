'use client';

import { signIn, useSession } from 'next-auth/react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Icons } from '@/components/icons';

const formSchema = z.object({
	username: z.string({ required_error: 'El usuario es requerido' }).min(1, {
		message: 'Por favor, ingrese un correo electrónico válido.',
	}),
	password: z.string({ required_error: 'El contraseña es requerida' }).min(6, {
		message: 'La contraseña debe tener al menos 6 caracteres.',
	}),
});

export const FormLogin = () => {
	const { status } = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: 'admin',
			password: 'password',
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		await signIn('credentials', {
			username: values.username,
			password: values.password,
			redirect: true,
			callbackUrl: '/',
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='username'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre de usuario</FormLabel>
							<FormControl>
								<Input disabled={isLoading} placeholder='usuario...' {...field} />
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
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<Input
									disabled={isLoading}
									type='password'
									placeholder='********'
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button disabled={isLoading || status === 'loading'} type='submit' className='w-full'>
					{isLoading && <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />}
					Ingresar
				</Button>
			</form>
		</Form>
	);
};
