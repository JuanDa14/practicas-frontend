import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { CardIconList } from './_components/card-icon-list';

export const metadata: Metadata = {
	title: 'DashBoard',
	description: 'DashBoard de la constructora WVS',
};

async function getData(access_token: string) {
	const res = await fetch(`${process.env.API_URL}/reports/generals`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		throw new Error('Problem fetching data');
	}

	const data = await res.json();

	return data;
}

const DashBoardPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const data = await getData(session.backendTokens.accessToken);

	return (
		<div className='p-6 space-y-5'>
			<div className='h-16 px-4 border-b'>
				<h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
				<p className='text-sm text-foreground line-clamp-1'>
					Muestra información general de la constructora WVS
				</p>
			</div>
			<CardIconList items={data} />
		</div>
	);
};

export default DashBoardPage;
