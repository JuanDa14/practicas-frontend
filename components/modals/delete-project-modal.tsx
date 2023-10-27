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
} from '../ui/alert-dialog';
import { useModal } from '@/hooks/use-modal-store';

export const DeleteProjectModal = () => {
	const [isLoading, setIsLoading] = useState(false);

	const [projectId, setProjectId] = useState('');

	const { data: session } = useSession();

	const { isOpen, onClose, data, type } = useModal();

	const { project } = data;

	const router = useRouter();

	const isModalOpen = isOpen && type === 'deleteProject';

	useEffect(() => {
		if (project) {
			setProjectId(project._id);
		}
	}, [project, setProjectId, projectId]);

	const onDelete = async () => {
		setIsLoading(true);

		try {
			await axios.delete(`/projects/${projectId}`, {
				headers: {
					Authorization: `Bearer ${session?.backendTokens.accessToken}`,
				},
			});
			toast.success('Proyecto eliminado correctamente.');
			router.refresh();
			router.push('/projects');
		} catch {
			toast.error('Ocurrio un error al eliminar el proyecto.');
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
						Esta acción no se puede deshacer. Esta eliminará el proyecto y todas las tareas
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
