'use client';

import { Separator } from '@/components/ui/separator';
import {
	ResponsiveContainer,
	LineChart as LineChartContainer,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	Line,
} from 'recharts';

interface LineChartProps {
	data: { _id: string; total: number }[];
}

export function LineChart({ data }: LineChartProps) {
	return (
		<div className='space-y-5'>
			<div className='my-5'>
				<h4 className='text-lg font-medium'>Grafica de proyectos completados y pendientes</h4>
				<p className='text-sm text-muted-foreground'>
					En esta grafica se muestran los proyectos completados y pendientes de acuerdo a su
					fecha de creacion
				</p>
			</div>
			<Separator />
			<div>
				<ResponsiveContainer width={'100%'} height={350}>
					<LineChartContainer
						data={data}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						className='w-full h-full'
					>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='_id' />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type='monotone' dataKey='total' stroke='#8884d8' />
					</LineChartContainer>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
