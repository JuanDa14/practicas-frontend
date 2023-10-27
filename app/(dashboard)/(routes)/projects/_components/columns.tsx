'use client';

import Link from 'next/link';
import { ArrowUpDown, Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Project } from '@/interfaces/project';
import { format, subDays } from 'date-fns';

export const columns: ColumnDef<Project>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Nombre
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className='text-xs capitalize font-medium line-clamp-2'>{row.original.name}</span>
		),
	},
	{
		accessorKey: 'creator',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Director
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className='text-xs capitalize font-medium'>
				{row.original.creator.firstName} {row.original.creator.lastName}
			</span>
		),
	},
	{
		accessorKey: 'client',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Cliente
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className='text-xs capitalize font-medium'>{row.original.client}</span>
		),
	},
	{
		accessorKey: 'deadline',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Fecha límite
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<span className='text-xs capitalize font-medium'>
				{String(format(new Date(row.original.deadline), 'dd/MM/yyyy'))}
			</span>
		),
	},
	{
		accessorKey: 'daysLeft',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Días restantes
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			const daysLeft = subDays(new Date(row.original.deadline), new Date().getDate());
			const formatDaysLeft = format(daysLeft, 'd');
			const isLessDaysLeft = new Date() > new Date(row.original.deadline);
			const isToday = new Date().getDate() === new Date(row.original.deadline).getDate();
			return (
				<span className='text-xs font-medium'>
					{isToday
						? 'Hoy'
						: isLessDaysLeft
						? '-'
						: Number(formatDaysLeft) === 1
						? `${Number(formatDaysLeft)} día`
						: `${Number(formatDaysLeft)} días`}
				</span>
			);
		},
	},
	{
		accessorKey: 'state',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Estado
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => {
			return (
				<Badge
					className={cn('text-xs', row.original.isFinished ? 'bg-green-600' : 'bg-yellow-600')}
				>
					{row.original.isFinished ? 'Finalizado' : 'En progreso'}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: 'Acciones',
		cell: ({ row }) => (
			<Link href={`/projects/${row.original._id}`}>
				<Button size={'icon'} type='button'>
					<Pencil className='w-4 h-4' />
				</Button>
			</Link>
		),
	},
];
