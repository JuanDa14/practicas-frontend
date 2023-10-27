'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { PlusCircle } from 'lucide-react';

import { User } from '@/interfaces/user';

import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	ColumnFiltersState,
	getFilteredRowModel,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnDef,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DataTableProps {
	data: User[];
	columns: ColumnDef<User>[];
}

export function DataTable<User, TValue>({ columns, data }: DataTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const [sorting, setSorting] = useState<SortingState>([]);

	const { data: session } = useSession();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div className='p-6'>
			<div>
				<div>
					<div className='h-16 px-4 border-b'>
						<h2 className='text-3xl font-bold tracking-tight'>Usuarios</h2>
						<p className='text-sm text-foreground line-clamp-1'>
							Lista de los usuarios registrados en el sistema.
						</p>
					</div>
					<div className='my-4'>
						<div className='flex w-full items-center justify-between gap-x-4'>
							<Input
								placeholder='Buscar por nombre de usuario...'
								value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
								onChange={(event) =>
									table.getColumn('username')?.setFilterValue(event.target.value)
								}
								className='w-1/2 md:w-[400px]'
							/>
							<Link href={'/users/create'} className='w-1/2 md:w-auto' title='Crear usuario'>
								<Button className='w-full' size={'sm'}>
									Nuevo usuario
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length > 1 ? (
							table
								.getRowModel()
								.rows.filter((row) => row.original!._id !== session?.user._id)
								.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										))}
									</TableRow>
								))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No hay datos para mostrar
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4 px-5'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					Anterior
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					Siguiente
				</Button>
			</div>
		</div>
	);
}
