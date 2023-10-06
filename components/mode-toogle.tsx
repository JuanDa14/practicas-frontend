'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

import {
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>Tema</DropdownMenuSubTrigger>
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuItem onClick={() => setTheme('light')}>Claro</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('dark')}>Oscuro</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setTheme('system')}>Sistema</DropdownMenuItem>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}
