'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { axios } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useModal } from '@/hooks/use-modal-store';

export const DeleteUserModal = () => {
	const { isOpen, onClose, data, type } = useModal();
	const { data: session } = useSession();
	const { user } = data;

	const [isLoading, setIsLoading] = useState(false);

	const [userId, setUserId] = useState('');

	const router = useRouter();

	const isModalOpen = isOpen && type === 'deleteUser';

	useEffect(() => {
		if (user) {
			setUserId(user._id);
		}
	}, [user, setUserId, userId]);

	const onDelete = async () => {
		setIsLoading(true);

		try {
			await axios.delete(`/users/${userId}`, {
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
				},
			});
			toast.success('Usuario eliminado correctamente.');
			router.refresh();
			router.push('/users');
		} catch {
			toast.error('Ocurrio un error al eliminar el usuario.');
		} finally {
			setIsLoading(false);
			onClose();
		}
	};

	return (
		<AlertDialog open={isModalOpen} onOpenChange={onClose}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>¿Estás seguro de realizar esta acción?</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. Esta eliminará el usuario y todos lo asociado.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
					<AlertDialogAction onClick={onDelete} disabled={isLoading}>
						Continuar
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
