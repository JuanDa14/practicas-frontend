import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { options } from '@/lib/auth-options';

import { Separator } from '@/components/ui/separator';
import { FormSetting } from './_components/setting-form';

const SettingsPage = async () => {
	const session = await getServerSession(options);

	if (!session?.user) {
		return redirect('/login');
	}

	return (
		<div className='p-6'>
			<h3 className='text-lg font-medium'>Perfil</h3>
			<p className='text-sm text-muted-foreground'>Actualiza tu información personal.</p>
			<Separator className='my-3' />
			<FormSetting user={session.user} />
		</div>
	);
};

export default SettingsPage;
