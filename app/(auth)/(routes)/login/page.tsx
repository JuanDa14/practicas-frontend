import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import { options } from '@/lib/auth-options';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { FormLogin } from './_components/form-login';

const Page = async () => {
	const session = await getServerSession(options);

	session?.user && redirect('/');

	return (
		<div className='w-full min-h-screen flex items-center justify-center px-5 md:px-0'>
			<Card className='mx-auto flex w-full flex-col justify-center sm:w-[450px] shadow rounded md:p-6'>
				<CardHeader className='flex flex-col space-y-2 text-center'>
					<CardTitle className='text-2xl font-semibold'>Constructura WVS</CardTitle>
					<CardDescription className='text-sm text-muted-foreground'>
						Inicia sesión con tu usuario y contraseña.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FormLogin />
				</CardContent>
				<CardFooter>
					<p className='text-center text-sm text-muted-foreground'>
						Al continuar, aceptas los{' '}
						<Link href='/terms' className='underline underline-offset-4 hover:text-primary'>
							Términos de servicio
						</Link>{' '}
						y{' '}
						<Link href='/privacy' className='underline underline-offset-4 hover:text-primary'>
							Política de privacidad
						</Link>
						.
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Page;
