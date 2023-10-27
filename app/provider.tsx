'use client';

import { SessionProvider } from 'next-auth/react';
import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

interface NextAuthProviderProps {
	children: React.ReactNode;
}

export const NextAuthProvider = ({ children }: NextAuthProviderProps) => {
	return (
		<SessionProvider>
			<ThemeProvider attribute='class' defaultTheme='light' enableSystem>
				{children}
				<ModalProvider />
				<ToastProvider />
				<ConfettiProvider />
			</ThemeProvider>
		</SessionProvider>
	);
};
