'use client';

import { useEffect, useState } from 'react';
import { AddCollaboratorModal } from '@/components/modals/add-collaborator-modal';
import { CreateTaskModal } from '@/components/modals/create-task-modal';
import { DeleteProjectModal } from '@/components/modals/delete-project-modal';
import { DeleteUserModal } from '@/components/modals/delete-user-modal';
import { DeleteRoleModal } from '@/components/modals/delete-role-modal';

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			<AddCollaboratorModal />
			<CreateTaskModal />
			<DeleteProjectModal />
			<DeleteUserModal />
			<DeleteRoleModal />
		</>
	);
};
