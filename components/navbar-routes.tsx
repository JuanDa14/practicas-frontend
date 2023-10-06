'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { UserButton } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { UserButton } from '@/components/user-button';
// import { SearchInput } from './search-input';

export const NavbarRoutes = () => {
	const pathname = usePathname();

	return (
		<>
			<div className='flex gap-x-2 ml-auto'>
				<UserButton />
			</div>
		</>
	);
};
