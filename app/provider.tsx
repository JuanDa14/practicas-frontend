'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { SessionProvider } from 'next-auth/react';

interface NextAuthProviderProps {
	children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
	return (
		<SessionProvider>
			<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
				{children}
				<ToastProvider />
			</ThemeProvider>
		</SessionProvider>
	);
};
