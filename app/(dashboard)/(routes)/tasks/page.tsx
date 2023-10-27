import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Separator } from '@/components/ui/separator';
import { TaskWithProject } from '@/interfaces/task';
import { ListCardTasks } from './_components/list-card-tasks';

export const metadata: Metadata = {
	title: 'Tareas',
	description: 'Lista de tareas ordenadas por proyecto.',
};

async function getTasks(access_token: string): Promise<Array<TaskWithProject>> {
	const res = await fetch(`${process.env.API_URL}/tasks`, {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});

	if (!res.ok) {
		throw new Error('Problem fetching tasks');
	}

	const data = await res.json();

	return data;
}

const TasksPage = async () => {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		redirect('/login');
	}

	const tasks = await getTasks(session.backendTokens.accessToken);

	return (
		<div className='flex-1 flex flex-col p-4 space-y-2'>
			<div className='flex justify-between items-center gap-5'>
				<div>
					<h2 className='text-lg font-medium'>Tareas</h2>
					<p className='text-sm text-muted-foreground'>
						Estas son las tareas que tienes en tu cuenta.
					</p>
				</div>
			</div>
			<Separator />
			<ListCardTasks tasks={tasks} />
		</div>
	);
};

export default TasksPage;
