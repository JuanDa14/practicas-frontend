'use client';

import { useSession } from 'next-auth/react';

interface ProtectedComponentProps {
	roles:
		| Array<'ADMINISTRADOR' | 'SUPER USUARIO' | 'USUARIO'>
		| ('ADMINISTRADOR' | 'SUPER USUARIO' | 'USUARIO');
	children: React.ReactNode;
}

export const ProtectedComponent = ({ roles, children }: ProtectedComponentProps) => {
	const { data: session } = useSession();

	if (!session?.user?.role) {
		return null;
	}

	if (typeof roles === 'string') {
		if (session?.user?.role.name !== roles) {
			return null;
		}
	}

	if (Array.isArray(roles)) {
		if (!roles.includes(session?.user?.role.name as any)) {
			return null;
		}
	}

	return <>{children}</>;
};
