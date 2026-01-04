import { Note } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NoteContextType {
	notes: Note[];
	trash: Note[]; // Notes in the bin
	addNote: (
		title: string,
		content: string,
		tags: string[],
		isPrivate?: boolean
	) => void;
	moveToTrash: (id: string) => void; // "Soft" delete
	moveMultipleToTrash: (ids: string[]) => void; // Batch delete
	restoreNote: (id: string) => void; // Bring back
	restoreMultipleNotes: (ids: string[]) => void; // Batch restore
	permanentlyDelete: (id: string) => void; // "Hard" delete
	permanentlyDeleteMultiple: (ids: string[]) => void; // Batch permanent delete
	updateNote: (
		id: string,
		title: string,
		content: string,
		tags: string[],
		isPrivate?: boolean
	) => void;
	togglePrivate: (id: string) => void; // Toggle private status
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

const SAMPLE_NOTES: Note[] = [
	{
		id: "sample-note-1",
		title: "How to Add Notes",
		content:
			"Welcome to BrainLog! 📝\n\nTo create a new note:\n1. Tap the + button at the bottom\n2. Enter your note title and content\n3. Add tags by typing #tagname\n4. Save your note\n\nNotes are automatically organized by date. You can search through all your notes using the search bar at the top.",
		tags: ["#tutorial", "#notes"],
		date: new Date("2026-01-04T10:00:00"),
		isPrivate: false,
	},
	{
		id: "sample-note-2",
		title: "How to Open Private Notes",
		content:
			"Private notes keep your sensitive information secure! 🔒\n\nTo access private notes:\n1. Go to the Private tab in the main menu\n2. Authenticate with your security method (PIN/Pattern/Biometric)\n3. View and manage your private notes\n\nYou can also mark any note as private by toggling the lock icon when editing.",
		tags: ["#tutorial", "#security"],
		date: new Date("2026-01-04T09:30:00"),
		isPrivate: false,
	},
	{
		id: "sample-note-3",
		title: "How to Recover Deleted Notes",
		content:
			"Accidentally deleted something? No worries! 🗑️\n\nTo recover deleted notes:\n1. Navigate to the Deleted tab\n2. Find the note you want to restore\n3. Long press to select it\n4. Tap the restore icon\n\nNote: Deleted items are kept for 30 days before permanent deletion.",
		tags: ["#tutorial", "#help"],
		date: new Date("2026-01-04T09:00:00"),
		isPrivate: false,
	},
];

const SAMPLE_PRIVATE_NOTES: Note[] = [
	{
		id: "sample-private-1",
		title: "How to Create a Private Note",
		content:
			"Create secure private notes for sensitive information! 🔐\n\nSteps to create a private note:\n1. From the Private section (requires authentication)\n2. Tap the + button\n3. Write your note\n4. It's automatically marked as private\n\nAlternatively:\n• Add #private or #secret tags to any note\n• Toggle the lock icon in the note editor\n\nPrivate notes won't appear in your main notes view.",
		tags: ["#private", "#tutorial"],
		date: new Date("2026-01-04T08:30:00"),
		isPrivate: true,
	},
];

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
	const [notes, setNotes] = useState<Note[]>([]); // Active notes
	const [trash, setTrash] = useState<Note[]>([]); // Deleted notes
	const [isInitialized, setIsInitialized] = useState(false);

	// Initialize sample notes on first run
	useEffect(() => {
		if (!isInitialized && notes.length === 0 && trash.length === 0) {
			setNotes([...SAMPLE_NOTES, ...SAMPLE_PRIVATE_NOTES]);
			setIsInitialized(true);
		}
	}, [isInitialized, notes.length, trash.length]);

	// 1. Check for expired notes on App Start
	useEffect(() => {
		const now = new Date();
		const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

		// Remove items that have been in trash for > 30 days
		setTrash((prevTrash) =>
			prevTrash.filter((note) => {
				if (!note.deletedAt) return true; // Safety check
				const timeInTrash = now.getTime() - new Date(note.deletedAt).getTime();
				return timeInTrash < thirtyDaysInMs; // Keep only if less than 30 days
			})
		);
	}, []);

	const addNote = (
		title: string,
		content: string,
		tags: string[],
		isPrivate?: boolean
	) => {
		// Auto-detect if note is private: if any tag contains "secret" or "private", it's private
		const hasPrivateTags = tags.some(
			(tag) =>
				tag.toLowerCase().includes("secret") ||
				tag.toLowerCase().includes("private")
		);
		const finalIsPrivate = isPrivate !== undefined ? isPrivate : hasPrivateTags;

		const newNote: Note = {
			id: Date.now().toString(),
			title: title || "Untitled",
			content,
			tags,
			date: new Date(),
			isPrivate: finalIsPrivate,
		};
		setNotes([newNote, ...notes]);
	};

	const updateNote = (
		id: string,
		title: string,
		content: string,
		tags: string[],
		isPrivate?: boolean
	) => {
		// Auto-detect if note is private: if any tag contains "secret" or "private", it's private
		const hasPrivateTags = tags.some(
			(tag) =>
				tag.toLowerCase().includes("secret") ||
				tag.toLowerCase().includes("private")
		);
		const finalIsPrivate = isPrivate !== undefined ? isPrivate : hasPrivateTags;

		setNotes((prev) =>
			prev.map((n) =>
				n.id === id
					? {
							...n,
							title,
							content,
							tags,
							isPrivate: finalIsPrivate,
							date: new Date(),
						}
					: n
			)
		);
	};

	// 2. Soft Delete: Move from Notes -> Trash
	const moveToTrash = (id: string) => {
		const noteToDelete = notes.find((n) => n.id === id);
		if (noteToDelete) {
			// Add 'deletedAt' timestamp
			const trashedNote = { ...noteToDelete, deletedAt: new Date() };
			setTrash([trashedNote, ...trash]);
			setNotes(notes.filter((n) => n.id !== id));
		}
	};

	// Batch delete multiple notes
	const moveMultipleToTrash = (ids: string[]) => {
		const notesToDelete = notes.filter((n) => ids.includes(n.id));
		const trashedNotes = notesToDelete.map((note) => ({
			...note,
			deletedAt: new Date(),
		}));
		setTrash([...trashedNotes, ...trash]);
		setNotes(notes.filter((n) => !ids.includes(n.id)));
	};

	// 3. Restore: Move from Trash -> Notes
	const restoreNote = (id: string) => {
		const noteToRestore = trash.find((n) => n.id === id);
		if (noteToRestore) {
			const activeNote = { ...noteToRestore, deletedAt: undefined };
			setNotes([activeNote, ...notes]);
			setTrash(trash.filter((n) => n.id !== id));
		}
	};

	// Batch restore multiple notes
	const restoreMultipleNotes = (ids: string[]) => {
		const notesToRestore = trash.filter((n) => ids.includes(n.id));
		const restoredNotes = notesToRestore.map((note) => ({
			...note,
			deletedAt: undefined,
		}));
		setNotes([...restoredNotes, ...notes]);
		setTrash(trash.filter((n) => !ids.includes(n.id)));
	};

	// 4. Permanent Delete
	const permanentlyDelete = (id: string) => {
		setTrash(trash.filter((n) => n.id !== id));
	};

	// Batch permanent delete multiple notes
	const permanentlyDeleteMultiple = (ids: string[]) => {
		setTrash(trash.filter((n) => !ids.includes(n.id)));
	};

	// 5. Toggle Private Status
	const togglePrivate = (id: string) => {
		setNotes((prev) =>
			prev.map((n) => (n.id === id ? { ...n, isPrivate: !n.isPrivate } : n))
		);
	};

	return (
		<NoteContext.Provider
			value={{
				notes,
				trash,
				addNote,
				moveToTrash,
				moveMultipleToTrash,
				restoreNote,
				restoreMultipleNotes,
				permanentlyDelete,
				permanentlyDeleteMultiple,
				updateNote,
				togglePrivate,
			}}
		>
			{children}
		</NoteContext.Provider>
	);
};

export const useNotes = () => {
	const context = useContext(NoteContext);
	if (!context) throw new Error("useNotes must be used within a NoteProvider");
	return context;
};
