'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toogle';

export const UserButton = () => {
	const router = useRouter();

	const { data: session } = useSession();

	const handleSignOut = () => {
		signOut({ callbackUrl: '/login' });
	};

	const onNavigate = (url: string) => {
		router.push(url);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-8 w-8 rounded-full'>
					<Avatar className='h-12 w-12'>
						<AvatarImage src={session?.user.username} alt={session?.user?.username} />
						<AvatarFallback>{session?.user?.username}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56' align='end' forceMount>
				<DropdownMenuLabel className='font-normal'>
					<div className='flex flex-col space-y-1'>
						<span className='text-sm font-medium leading-none'>
							{session?.user?.firstName} {session?.user.lastName}
						</span>
						<span className='text-xs leading-none text-muted-foreground'>
							{session?.user?.username}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => onNavigate('/settings')}>
						Perfil
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Facturación
						<DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
					</DropdownMenuItem>

					<ModeToggle />

					<DropdownMenuItem>
						Configuración
						<DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleSignOut}>
					Cerrar sesión
					<DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
