'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectWithCreator } from '@/interfaces/project';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface CreateProjectPageProps {
	project: ProjectWithCreator;
}

export const CardProject = ({ project }: CreateProjectPageProps) => {
	const router = useRouter();

	const onNavigate = () => {
		router.push(`/projects/${project._id}`);
	};

	return (
		<Card onClick={onNavigate} className='cursor-pointer'>
			<CardHeader>
				<CardTitle className='line-clamp-1 text-xl'>{project.name}</CardTitle>
				<CardDescription className='line-clamp-2'>{project.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='text-xs space-y-1'>
					<p className='line-clamp-1'>Cliente : {project.client || 'Sin cliente'}</p>
					<p className='line-clamp-1'>
						Encargado : {project.creator.firstName} {project.creator.lastName}
					</p>
					<p className='line-clamp-1'>
						Fecha límite : {format(new Date(project.deadline), 'dd/MM/yyyy')}
					</p>
				</div>
			</CardContent>
		</Card>
	);
};
