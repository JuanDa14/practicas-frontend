import { Card, CardContent } from '@/components/ui/card';
import { ChartProjects } from './chart-projects';

interface TabsProps {
	createdProjects: { totalProjects: number; year: number; month: number }[];
	completedProjects: { _id: string; total: number }[];
}

export function CardChartProjects({ createdProjects, completedProjects }: TabsProps) {
	return (
		<div className='w-full h-full p-6'>
			<Card>
				<CardContent className='space-y-2'>
					<ChartProjects
						createdProjects={createdProjects}
						completedProjects={completedProjects}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
