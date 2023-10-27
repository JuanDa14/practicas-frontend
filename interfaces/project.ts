import { Task } from './task';
import { User } from './user';

export interface Project {
	_id: string;
	name: string;
	description: string;
	client: string;
	deadline: Date;
	creator: User;
	tasks: Task[];
	collaborators: User[];
	createdAt: Date;
	updatedAt: Date;
	isFinished: boolean;
}
