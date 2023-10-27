'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	ColumnFiltersState,
	getFilteredRowModel,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
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
import { Role } from '@/interfaces/role';

interface DataTableProps {
	data: Role[];
	columns: ColumnDef<Role>[];
}

export function DataTable({ data = [], columns = [] }: DataTableProps) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = useState<SortingState>([]);

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
						<h2 className='text-3xl font-bold tracking-tight'>Roles</h2>
						<p className='text-sm text-foreground'>
							Lista de los roles registrados en el sistema.
						</p>
					</div>
					<div className='my-4'>
						<div className='flex w-full items-center justify-between gap-x-2'>
							<Input
								type='search'
								placeholder='Buscar por nombre...'
								value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
								onChange={(event) =>
									table.getColumn('name')?.setFilterValue(event.target.value)
								}
								className='w-[300px] md:w-[400px]'
							/>

							<Link href={'/roles/create'} className='w-1/2 md:w-auto' title='Crear rol'>
								<Button className='w-full' size={'sm'}>
									Nuevo rol
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
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
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
