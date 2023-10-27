'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { es } from 'date-fns/locale';

interface DatePickerProps {
	value: Date;
	onChange: (date?: Date) => void;
	isDisabled?: boolean;
}

export function DatePicker({ value, onChange, isDisabled }: DatePickerProps) {
	return (
		<Popover modal>
			<PopoverTrigger asChild>
				<Button
					disabled={isDisabled}
					variant={'outline'}
					className={cn(
						'w-full justify-start text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					<CalendarIcon className='mr-2 h-4 w-4' />
					{value ? format(value, 'PPP', { locale: es }) : <span>Seleccione fecha...</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-auto p-0'>
				<Calendar
					disabled={isDisabled}
					locale={es}
					selected={value}
					onSelect={onChange}
					mode='single'
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
