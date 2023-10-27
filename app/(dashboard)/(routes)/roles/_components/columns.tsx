'use client';

import Link from 'next/link';
import { ArrowUpDown, Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/interfaces/role';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<Role>[] = [
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
			<span className='text-xs capitalize font-medium'>{row.original.name}</span>
		),
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
		cell: ({ row }) => (
			<Badge className={cn('text-xs', row.original.state ? 'bg-emerald-600' : 'bg-red-600')}>
				{row.original.state ? 'Activo' : 'Inactivo'}
			</Badge>
		),
	},
	{
		accessorKey: 'actions',
		header: 'Acciones',
		cell: ({ row }) => (
			<Link href={`/roles/${row.original._id}`}>
				<Button size={'icon'} type='button'>
					<Pencil className='w-4 h-4' />
				</Button>
			</Link>
		),
	},
];
