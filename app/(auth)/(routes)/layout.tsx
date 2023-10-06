interface AuthLayoutProps {
	children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
	return <div className='w-full min-h-screen flex justify-center items-center'>{children}</div>;
};

export default AuthLayout;
