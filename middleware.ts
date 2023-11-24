export { default } from 'next-auth/middleware';

export const config = {
	matcher: [
		'/',
		'/collaborators/:path*',
		'/dashboard/:path*',
		'/projects/:path*',
		'/roles/:path*',
		'/settings/:path*',
		'/tasks/:path*',
		'/users/:path*',
	],
};
