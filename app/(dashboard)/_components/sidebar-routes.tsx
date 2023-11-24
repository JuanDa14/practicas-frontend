'use client';

import { BarChart, Layout, List, Users2, Settings2, Users2Icon, FileArchive } from 'lucide-react';
import { SidebarItem } from '@/app/(dashboard)/_components/sidebar-item';
import { ProtectedComponent } from '@/components/protected-component';

const routes = [
	{
		icon: Layout,
		label: 'Dashboard',
		href: '/dashboard',
		private: false,
	},
	{
		icon: Users2Icon,
		label: 'Usuarios',
		href: '/users',
		private: true,
	},
	{
		icon: List,
		label: 'Roles',
		href: '/roles',
		private: true,
	},
	{
		icon: BarChart,
		label: 'Proyectos',
		href: '/projects',
		private: false,
	},
	{
		icon: FileArchive,
		label: 'Reportes',
		href: '/reports',
		private: true,
	},
	{
		icon: List,
		label: 'Tareas',
		href: '/tasks',
		private: false,
	},
	{
		icon: Users2,
		label: 'Colaboradores',
		href: '/collaborators',
		private: false,
	},
	{
		icon: Settings2,
		label: 'Configuración',
		href: '/settings',
		private: false,
	},
];

export const SidebarRoutes = () => {
	return (
		<div className='flex flex-col w-full dark:bg-primary-foreground'>
			{routes.map((route) => (
				<div key={route.label} className='w-full h-full'>
					{route.private ? (
						<ProtectedComponent roles={'ADMINISTRADOR'}>
							<SidebarItem icon={route.icon} label={route.label} href={route.href} />
						</ProtectedComponent>
					) : (
						<SidebarItem icon={route.icon} label={route.label} href={route.href} />
					)}
				</div>
			))}
		</div>
	);
};
