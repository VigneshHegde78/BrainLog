import { Note } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface NoteContextType {
	notes: Note[];
	trash: Note[]; // Notes in the bin
	addNote: (title: string, content: string, tags: string[]) => void;
	moveToTrash: (id: string) => void; // "Soft" delete
	restoreNote: (id: string) => void; // Bring back
	permanentlyDelete: (id: string) => void; // "Hard" delete
	updateNote: (
		id: string,
		title: string,
		content: string,
		tags: string[]
	) => void;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children }: { children: React.ReactNode }) => {
	const [notes, setNotes] = useState<Note[]>([]); // Active notes
	const [trash, setTrash] = useState<Note[]>([]); // Deleted notes

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

	const addNote = (title: string, content: string, tags: string[]) => {
		const newNote: Note = {
			id: Date.now().toString(),
			title: title || "Untitled",
			content,
			tags,
			date: new Date(),
		};
		setNotes([newNote, ...notes]);
	};

	const updateNote = (
		id: string,
		title: string,
		content: string,
		tags: string[]
	) => {
		setNotes((prev) =>
			prev.map((n) =>
				n.id === id ? { ...n, title, content, tags, date: new Date() } : n
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

	// 3. Restore: Move from Trash -> Notes
	const restoreNote = (id: string) => {
		const noteToRestore = trash.find((n) => n.id === id);
		if (noteToRestore) {
			const activeNote = { ...noteToRestore, deletedAt: undefined };
			setNotes([activeNote, ...notes]);
			setTrash(trash.filter((n) => n.id !== id));
		}
	};

	// 4. Permanent Delete
	const permanentlyDelete = (id: string) => {
		setTrash(trash.filter((n) => n.id !== id));
	};

	return (
		<NoteContext.Provider
			value={{
				notes,
				trash,
				addNote,
				moveToTrash,
				restoreNote,
				permanentlyDelete,
				updateNote,
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
