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

export const DeleteRoleModal = () => {
	const { isOpen, onClose, data, type } = useModal();
	const { data: session } = useSession();
	const { role } = data;

	const [isLoading, setIsLoading] = useState(false);

	const [roleId, setRoleId] = useState('');

	const router = useRouter();

	const isModalOpen = isOpen && type === 'deleteRole';

	useEffect(() => {
		if (role) {
			setRoleId(role._id);
		}
	}, [role, setRoleId, roleId]);

	const onDelete = async () => {
		setIsLoading(true);

		try {
			await axios.delete(`/roles/${roleId}`, {
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
				},
			});
			toast.success('Rol eliminado correctamente.');
			router.refresh();
			router.push('/roles');
		} catch {
			toast.error('Ocurrio un error al eliminar el rol.');
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
						Esta acción no se puede deshacer. Esta eliminará el rol.
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
