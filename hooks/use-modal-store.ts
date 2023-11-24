import { Project, ProjectWithCreator } from '@/interfaces/project';
import { Role } from '@/interfaces/role';
import { Task } from '@/interfaces/task';
import { User } from '@/interfaces/user';
import { create } from 'zustand';

export type ModalType =
	| 'addCollaborators'
	| 'createTask'
	| 'deleteProject'
	| 'deleteUser'
	| 'deleteRole';

interface ModalData {
	project?: Project | ProjectWithCreator;
	task?: Task;
	user?: User;
	role?: Role;
}

interface ModalStore {
	type: ModalType | null;
	data: ModalData;
	isOpen: boolean;
	onOpen: (type: ModalType, data?: ModalData) => void;
	onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ type: null, isOpen: false }),
}));
