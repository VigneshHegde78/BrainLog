import { List, ListItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ListContextType {
	lists: List[];
	trash: List[];
	addList: (title: string, items: ListItem[]) => void;
	updateList: (id: string, title: string, items: ListItem[]) => void;
	deleteList: (id: string) => void;
	getListById: (id: string) => List | undefined;
	moveToTrash: (id: string) => void;
	moveMultipleToTrash: (ids: string[]) => void;
	restoreList: (id: string) => void;
	restoreMultipleLists: (ids: string[]) => void;
	permanentlyDelete: (id: string) => void;
	permanentlyDeleteMultiple: (ids: string[]) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

const STORAGE_KEY = "@lists";

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
	const [lists, setLists] = useState<List[]>([]);
	const [trash, setTrash] = useState<List[]>([]);

	// Load lists from AsyncStorage on mount
	useEffect(() => {
		loadLists();
	}, []);

	// Save lists to AsyncStorage whenever they change
	useEffect(() => {
		saveLists();
	}, [lists]);

	// Clean up old trash items (30 days)
	useEffect(() => {
		const now = new Date();
		const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

		const allLists = [...lists, ...trash];
		const cleanedLists = allLists.filter((list) => {
			if (!list.deletedAt) return true;
			const timeInTrash = now.getTime() - new Date(list.deletedAt).getTime();
			return timeInTrash < thirtyDaysInMs;
		});

		const activeItems = cleanedLists.filter((l) => !l.deletedAt);
		const trashedItems = cleanedLists.filter((l) => l.deletedAt);

		setLists(activeItems);
		setTrash(trashedItems);
	}, []);

	const loadLists = async () => {
		try {
			const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedLists) {
				const parsedLists = JSON.parse(storedLists);
				// Convert date strings back to Date objects
				const listsWithDates = parsedLists.map((list: any) => ({
					...list,
					date: new Date(list.date),
					deletedAt: list.deletedAt ? new Date(list.deletedAt) : undefined,
				}));

				// Separate active and deleted lists
				const activeItems = listsWithDates.filter((l: List) => !l.deletedAt);
				const trashedItems = listsWithDates.filter((l: List) => l.deletedAt);

				setLists(activeItems);
				setTrash(trashedItems);
			}
		} catch (error) {
			console.error("Error loading lists:", error);
		}
	};

	const saveLists = async () => {
		try {
			const allLists = [...lists, ...trash];
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(allLists));
		} catch (error) {
			console.error("Error saving lists:", error);
		}
	};

	const addList = (title: string, items: ListItem[]) => {
		const newList: List = {
			id: Date.now().toString(),
			title: title || "Untitled List",
			items,
			date: new Date(),
		};
		setLists([newList, ...lists]);
	};

	const updateList = (id: string, title: string, items: ListItem[]) => {
		setLists(
			lists.map((list) =>
				list.id === id
					? { ...list, title: title || "Untitled List", items }
					: list
			)
		);
	};

	const deleteList = (id: string) => {
		setLists(lists.filter((list) => list.id !== id));
	};

	const getListById = (id: string): List | undefined => {
		return lists.find((list) => list.id === id);
	};

	const moveToTrash = (id: string) => {
		const listToDelete = lists.find((l) => l.id === id);
		if (listToDelete) {
			const trashedList = { ...listToDelete, deletedAt: new Date() };
			setTrash([trashedList, ...trash]);
			setLists(lists.filter((l) => l.id !== id));
		}
	};

	const moveMultipleToTrash = (ids: string[]) => {
		const listsToDelete = lists.filter((l) => ids.includes(l.id));
		const trashedLists = listsToDelete.map((list) => ({
			...list,
			deletedAt: new Date(),
		}));
		setTrash([...trashedLists, ...trash]);
		setLists(lists.filter((l) => !ids.includes(l.id)));
	};

	const restoreList = (id: string) => {
		const listToRestore = trash.find((l) => l.id === id);
		if (listToRestore) {
			const restoredList = { ...listToRestore, deletedAt: undefined };
			setLists([restoredList, ...lists]);
			setTrash(trash.filter((l) => l.id !== id));
		}
	};

	const restoreMultipleLists = (ids: string[]) => {
		const listsToRestore = trash.filter((l) => ids.includes(l.id));
		const restoredLists = listsToRestore.map((list) => ({
			...list,
			deletedAt: undefined,
		}));
		setLists([...restoredLists, ...lists]);
		setTrash(trash.filter((l) => !ids.includes(l.id)));
	};

	const permanentlyDelete = (id: string) => {
		setTrash(trash.filter((list) => list.id !== id));
	};

	const permanentlyDeleteMultiple = (ids: string[]) => {
		setTrash(trash.filter((list) => !ids.includes(list.id)));
	};

	return (
		<ListContext.Provider
			value={{
				lists,
				trash,
				addList,
				updateList,
				deleteList,
				getListById,
				moveToTrash,
				moveMultipleToTrash,
				restoreList,
				restoreMultipleLists,
				permanentlyDelete,
				permanentlyDeleteMultiple,
			}}
		>
			{children}
		</ListContext.Provider>
	);
};

export const useList = () => {
	const context = useContext(ListContext);
	if (!context) {
		throw new Error("useList must be used within ListProvider");
	}
	return context;
};
