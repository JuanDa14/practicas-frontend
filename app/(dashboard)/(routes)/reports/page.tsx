import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { subYears, format, addYears } from 'date-fns';

import { authOptions } from '@/lib/auth-options';
import { CardChartProjects } from './_components/card-chart-projects';

async function getCreatedProjects(access_token: string, from: string, to: string) {
	const resp = await fetch(
		`${process.env.API_URL}/reports/projects-created?from=${from}&to=${to}`,
		{
			cache: 'no-cache',
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		}
	);

	if (!resp.ok) {
		throw new Error('Error al obtener los proyectos creados por fecha');
	}

	const data = await resp.json();

	return data;
}

async function getCompletedProjects(access_token: string) {
	const resp = await fetch(`${process.env.API_URL}/reports/completed-projects`, {
		cache: 'no-cache',
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!resp.ok) {
		throw new Error('Error al obtener los proyectos completados');
	}

	const data = await resp.json();

	return data;
}

const ReportPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const from = format(subYears(new Date(), 1), 'yyyy-MM-dd');
	const to = format(addYears(new Date(), 1), 'yyyy-MM-dd');

	const [createdProjects, completedProjects] = await Promise.all([
		getCreatedProjects(session.backendTokens.accessToken, from, to),
		getCompletedProjects(session.backendTokens.accessToken),
	]);

	return (
		<div>
			<CardChartProjects
				createdProjects={createdProjects}
				completedProjects={completedProjects}
			/>
		</div>
	);
};

export default ReportPage;
