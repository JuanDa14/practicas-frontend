'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
	Bar,
	CartesianGrid,
	ComposedChart as ComposedChartContainer,
	Legend,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { DatePicker } from '@/components/date-picker';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { axios } from '@/lib/axios';
import { formatNumberToMonth } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ComposeChartProps {
	data: {
		totalProjects: number;
		year: number;
		month: number;
	}[];
}

const formatedData = (data: ComposeChartProps['data']) => {
	return data.map((item) => ({
		name: formatNumberToMonth(item.month),
		total: item.totalProjects,
		year: item.year,
		month: item.month,
	}));
};

const formSchema = z.object({
	dateStart: z.date({ required_error: 'La fecha inicial es requerida' }),
	dateEnd: z.date({ required_error: 'La fecha final es requerida' }),
});

export const ComposedChart = ({ data }: ComposeChartProps) => {
	const [dataChart, setDataChart] = useState(formatedData(data));

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			dateStart: new Date(),
			dateEnd: new Date(),
		},
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const to = format(values.dateEnd, 'yyyy-MM-dd');
			const from = format(values.dateStart, 'yyyy-MM-dd');

			const { data } = await axios.get(`reports/projects-created?from=${from}&to=${to}`);

			setDataChart(formatedData(data));
		} catch (error) {
			toast.error('Error al obtener los proyectos');
		}
	};

	return (
		<div className='space-y-5'>
			<div className='my-5'>
				<h4 className='text-lg font-medium'>Grafica de proyectos creados por fecha</h4>
				<p className='text-sm text-muted-foreground'>
					En esta grafica se muestran los proyectos creados por fecha
				</p>
			</div>
			<Separator />
			<div className='space-y-5'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex flex-col md:flex-row gap-x-5 items-center'
					>
						<FormField
							control={form.control}
							name='dateStart'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha inicio</FormLabel>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											isDisabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='dateEnd'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Fecha fin</FormLabel>
									<FormControl>
										<DatePicker
											value={field.value}
											onChange={field.onChange}
											isDisabled={isSubmitting}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={isSubmitting}>Filtrar</Button>
					</form>
				</Form>
				<div>
					<ResponsiveContainer width={'100%'} height={350}>
						<ComposedChartContainer width={730} height={250} data={dataChart}>
							<XAxis dataKey='name' />
							<YAxis />
							<Tooltip />
							<Legend />
							<CartesianGrid stroke='#f5f5f5' />
							<Bar dataKey='total' barSize={20} fill='#413ea0' />
							<Line type='monotone' dataKey='total' stroke='#ff7300' />
						</ComposedChartContainer>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};
