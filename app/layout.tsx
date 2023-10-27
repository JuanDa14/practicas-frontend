import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Loading from './loading';
import { NextAuthProvider } from './provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Constructora WVS',
	description: 'Sistema de gestión de proyectos de la constructora WVS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<html lang='en' suppressHydrationWarning>
				<body className={inter.className}>
					<Suspense fallback={<Loading />}>
						<NextAuthProvider>{children}</NextAuthProvider>
					</Suspense>
				</body>
			</html>
		</>
	);
}
