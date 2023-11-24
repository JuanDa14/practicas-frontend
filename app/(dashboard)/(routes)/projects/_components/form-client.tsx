'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Pencil, PlusCircle, SaveIcon, User, X } from 'lucide-react';
import { axios } from '@/lib/axios';
import { Project, ProjectWithCreator } from '@/interfaces/project';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { IconBadge } from '@/components/icon-badge';

interface FormClientProps {
	project: ProjectWithCreator;
}

const formSchema = z.object({
	client: z.string({ required_error: 'El cliente es requerido' }).min(5, {
		message: 'El cliente debe tener al menos 5 caracter.',
	}),
});

export const FormClient = ({ project }: FormClientProps) => {
	const router = useRouter();

	const { data: session } = useSession();

	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			client: project.client ? project.client : '',
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch<Project>(`/projects/${project._id}`, values, {
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
				},
			});
			toast.success('Cliente actualizado correctamente');
			router.refresh();
			setIsEditing(false);
		} catch (error) {
			toast.error('Ocurrio un error al actualizar el cliente');
		}
	};

	const onEditing = () => {
		setIsEditing(!isEditing);
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center gap-3'>
				<IconBadge icon={User} />
				<h3 className='text-lg font-medium'>Cliente</h3>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className='flex items-center gap-2'>
						{!isEditing && (
							<>
								<p className={cn('flex-1 text-sm', !project.client && 'italic')}>
									{!project.client ? 'El proyecto no tiene un cliente' : project.client}
								</p>
								<Button
									size={'icon'}
									onClick={onEditing}
									disabled={isSubmitting}
									type='button'
									variant={'secondary'}
								>
									{!project.client ? (
										<PlusCircle className='w-4 h-4' />
									) : (
										<Pencil className='w-4 h-4' />
									)}
								</Button>
							</>
						)}
						{isEditing && (
							<>
								<FormField
									control={form.control}
									name='client'
									render={({ field }) => (
										<FormItem className='w-full'>
											<FormControl>
												<Input
													disabled={isSubmitting}
													placeholder='Ingrese nombre del client...'
													{...field}
													className='flex-1'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='flex items-center gap-2'>
									<Button
										variant={'secondary'}
										size={'icon'}
										type='submit'
										disabled={!isValid || isSubmitting}
									>
										<SaveIcon className='w-4 h-4' />
									</Button>
									<Button
										size={'icon'}
										type='button'
										onClick={onEditing}
										disabled={isSubmitting}
										variant={'secondary'}
									>
										<X className='w-4 h-4' />
									</Button>
								</div>
							</>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
};
