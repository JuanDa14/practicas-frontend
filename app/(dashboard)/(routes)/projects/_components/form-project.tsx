'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
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
import { addDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/date-picker';
import { ProjectWithCreator } from '@/interfaces/project';
import { axios } from '@/lib/axios';
import { IconBadge } from '@/components/icon-badge';
import { File } from 'lucide-react';

const formSchema = z.object({
	name: z.string({ required_error: 'El nombre es requerido' }).min(1, {
		message: 'El nombre debe tener al menos 1 caracter.',
	}),
	description: z.string({ required_error: 'La descripcion es requerida' }).min(10, {
		message: 'La descripcion debe tener al menos 10 caracteres.',
	}),
	deadline: z.date({ required_error: 'La fecha de entrega es requerida' }),
	creator: z
		.string({ required_error: 'El creador es requerido' })
		.min(1, {
			message: 'El creador debe tener al menos 1 caracter.',
		})
		.optional(),
	client: z.string({ required_error: 'El cliente es requerido' }).optional(),
});

interface FormProjectProps {
	project?: ProjectWithCreator;
}

export const FormProject = ({ project }: FormProjectProps) => {
	const router = useRouter();

	const pathname = usePathname();

	const { data: session } = useSession();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: project
			? { ...project, creator: project.creator._id, deadline: new Date(project.deadline) }
			: {
					name: '',
					description: '',
					deadline: addDays(new Date(), 1),
					creator: session?.user._id,
					client: '',
			  },
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (project) {
			try {
				await axios.patch<ProjectWithCreator>(
					`/projects/${project._id}`,
					{ ...values, creator: session?.user._id },
					{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
				);
				toast.success('Proyecto actualizado correctamente.');
				router.refresh();
			} catch (error) {
				toast.error('Ocurrio un error al crear el proyecto.');
			}
		} else {
			try {
				const { data } = await axios.post<ProjectWithCreator>('/projects', {
					...values,
					creator: session?.user._id,
				});
				toast.success('Proyecto creado correctamente.');
				router.refresh();
				router.push(`/projects/${data._id}`);
			} catch (error) {
				toast.error('Ocurrio un error al crear el proyecto.');
			}
		}
	};

	return (
		<div className='space-y-4'>
			{!pathname.includes('create') && (
				<div className='flex items-center gap-3'>
					<IconBadge icon={File} />
					<h3 className='text-lg font-medium'>Informacion del proyecto</h3>
				</div>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre del proyecto</FormLabel>
									<FormControl>
										<Input
											disabled={isSubmitting}
											placeholder='Ingrese el nombre...'
											{...field}
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
									<FormLabel>Descripcion</FormLabel>
									<FormControl>
										<Textarea
											disabled={isSubmitting}
											placeholder='Ingrese la descripcion...'
											{...field}
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
									<FormLabel>Fecha limite</FormLabel>
									<FormControl>
										<DatePicker
											isDisabled={isSubmitting}
											onChange={field.onChange}
											value={field.value}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting} type='submit' className='w-full'>
							{isSubmitting ? (
								<Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
							) : (
								<span>{project ? 'Actualizar' : 'Guardar'}</span>
							)}
						</Button>
						{pathname.includes('create') && (
							<Button
								disabled={isSubmitting}
								type='button'
								size={'sm'}
								variant={'secondary'}
								className='w-full mt-3'
								onClick={() => router.back()}
							>
								Cancelar
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
};
