import { Project } from '@/interfaces/project';
import { User } from '@/interfaces/user';

export enum TYPE_PRIORITY {
	LOW = 'low',
	MEDIUM = 'medium',
	HIGH = 'high',
}

export interface Task {
	_id: string;
	name: string;
	description: string;
	status: boolean;
	deadline: Date;
	priority: TYPE_PRIORITY;
	completed?: User;
	createdAt: Date;
	updatedAt: Date;
	project: string;
}

export interface TaskWithProject {
	_id: string;
	name: string;
	description: string;
	status: boolean;
	deadline: Date;
	priority: TYPE_PRIORITY;
	completed?: User;
	createdAt: Date;
	updatedAt: Date;
	project: Project;
}
