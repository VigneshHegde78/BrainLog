// types/index.ts OR types.d.ts
export interface Task {
	id: string;
	title: string;
	completed: boolean;
}

// types/index.ts
export interface Note {
	id: string;
	title: string;
	content: string;
	tags: string[]; // <--- The core feature
	date: Date;
	deletedAt?: Date; // <--- For soft deletion
}
