import { Project } from '@/interfaces/project';
import { CardProject } from './card-project';

interface ListCardProjectsProps {
	projects: Project[];
}

export const ListCardProjects = ({ projects }: ListCardProjectsProps) => {
	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5'>
			{projects.map((project) => (
				<CardProject project={project} key={project._id} />
			))}
		</div>
	);
};
