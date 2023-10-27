'use client';

import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User } from '@/interfaces/user';
import { axios } from '@/lib/axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ListCollaboratorProps {
	collaborators: User[];
	projectId: string;
}

export const ListCollaborator = ({ collaborators, projectId }: ListCollaboratorProps) => {
	const { data: session } = useSession();

	const router = useRouter();

	const onDelete = async (username: string) => {
		try {
			await axios.post(
				'/collaborators/remove',
				{ username, projectId },
				{ headers: { Authorization: `Bearer ${session?.backendTokens.accessToken}` } }
			);
			toast.success('Colaborador eliminado');
			router.refresh();
		} catch {
			toast.error('No se pudo eliminar el colaborador');
		}
	};

	return (
		<div className='w-full flex flex-col gap-3'>
			{collaborators.map((collaborator) => (
				<div key={collaborator._id} className='w-full flex items-center justify-between'>
					<span className='text-base'>{collaborator.username}</span>
					<div className='flex gap-3 items-center'>
						<Button
							variant={'outline'}
							size={'icon'}
							onClick={() => {
								onDelete(collaborator.username);
							}}
						>
							<Trash className='w-4 h-4' />
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};
