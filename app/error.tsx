'use client';

const Error = () => {
	return (
		<div className='flex flex-col md:flex-row items-center justify-center h-screen gap-2'>
			<h1 className='text-4xl font-bold text-primary'>500</h1>
			<span className='hidden md:flex'>|</span>
			<p className='text-lg text-center'>Algo salió mal, por favor intente más tarde</p>
		</div>
	);
};

export default Error;
