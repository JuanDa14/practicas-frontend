'use client';

import { ComposedChart } from './composed-chart';
import { LineChart } from './line-chart';

interface ChartProjectsProps {
	createdProjects: { totalProjects: number; year: number; month: number }[];
	completedProjects: { _id: string; total: number }[];
}

export const ChartProjects = ({ completedProjects, createdProjects }: ChartProjectsProps) => {
	return (
		<div className='w-full grid grid-cols-1 gap-5 '>
			<div>
				<ComposedChart data={createdProjects} />
			</div>
			<div className='w-full h-full'>
				<LineChart data={completedProjects} />
			</div>
		</div>
	);
};
