// types/index.ts OR types.d.ts
export interface Task {
	id: string;
	title: string;
	completed: boolean;
	deletedAt?: Date;
}

// types/index.ts
export interface Note {
	id: string;
	title: string;
	content: string;
	tags: string[]; // <--- Stored with # prefix (e.g., "#work", "#notes")
	date: Date;
	deletedAt?: Date; // <--- For soft deletion
	isPrivate?: boolean; // <--- Mark as private note
}

// Helper function to filter tags for main notes screen (hide secret/private tags)
export const getVisibleTags = (tags: string[]): string[] => {
	return tags.filter(
		(tag) =>
			!tag.toLowerCase().includes("secret") &&
			!tag.toLowerCase().includes("private")
	);
};

// Helper function to get all tags (for private screen and editor)
export const getAllTags = (tags: string[]): string[] => {
	return tags;
};

export interface ListItem {
	id: string;
	text: string;
	completed: boolean;
}

export interface List {
	id: string;
	title: string;
	items: ListItem[];
	date: Date;
	deletedAt?: Date;
}
