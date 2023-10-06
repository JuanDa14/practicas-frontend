import { Loader } from 'lucide-react';

export const Spinner = () => {
	return (
		<div className='min-h-screen w-full flex items-center justify-center'>
			<Loader className='h-10 w-10 animate-spin' />
		</div>
	);
};
