'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

export interface CardIconProps {
	icon?: LucideIcon;
	title: string;
	description?: string;
	total: number;
}

export const CardIcon = ({ icon: Icon, title, description, total }: CardIconProps) => {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
				<CardTitle className='text-sm font-medium'>{title}</CardTitle>
				{Icon && <Icon className='h-4 w-4' />}
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{total}</div>
				<p className='text-xs text-muted-foreground'>Registrados en el sistema</p>
			</CardContent>
		</Card>
	);
};
