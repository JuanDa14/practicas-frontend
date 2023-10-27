'use client';

import { ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Search } from 'lucide-react';

interface InputSearchProps {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	value: string;
	onSearch: () => void;
	isSearching: boolean;
	isValid: boolean;
	isSubmitting?: boolean;
	placeholder?: string;
}

export const InputSearch = ({
	isSearching,
	onChange,
	value,
	onSearch,
	isValid,
	placeholder,
	isSubmitting,
}: InputSearchProps) => {
	return (
		<div className='flex gap-3'>
			<Input value={value} onChange={onChange} placeholder={placeholder || 'Buscar.....'} />
			<Button
				disabled={isValid || isSearching || isSubmitting}
				type='button'
				size={'icon'}
				onClick={onSearch}
			>
				{isSearching ? (
					<Loader2 className='animate-spin h-4 w-4' />
				) : (
					<Search className='h-4 w-4' />
				)}
			</Button>
		</div>
	);
};
