import { Navbar } from './_components/navbar';
import { Sidebar } from './_components/sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='flex flex-col w-full min-h-screen mx-auto bg-background'>
			<header className='h-[80px] md:pl-56 fixed inset-y-0 w-full z-50'>
				<Navbar />
			</header>
			<div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
				<Sidebar />
			</div>
			<main className='md:pl-56 pt-[80px] flex-1 flex flex-col w-full'>{children}</main>
		</div>
	);
};

export default DashboardLayout;
