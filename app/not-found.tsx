const NotFound = () => {
	return (
		<div className='flex flex-col md:flex-row items-center justify-center h-screen gap-2'>
			<h1 className='text-4xl font-bold text-primary'>404</h1>
			<span className='hidden md:flex'>|</span>
			<p className='text-lg text-center'>Esta página no se encuentra disponible</p>
		</div>
	);
};

export default NotFound;
