import { List, ListItem } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ListContextType {
	lists: List[];
	addList: (title: string, items: ListItem[]) => void;
	updateList: (id: string, title: string, items: ListItem[]) => void;
	deleteList: (id: string) => void;
	deleteMultipleLists: (ids: string[]) => void;
	getListById: (id: string) => List | undefined;
	replaceAll: (lists: List[]) => void;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

const STORAGE_KEY = "@lists";

const SAMPLE_LISTS: List[] = [
	{
		id: "sample-list-1",
		title: "How to Create and Manage Lists? 📋",
		items: [
			{
				id: "l1",
				text: "Tap the + button to create a new list",
				completed: false,
			},
			{ id: "l2", text: "Give your list a title", completed: false },
			{
				id: "l3",
				text: "Add items by typing and pressing the + icon",
				completed: false,
			},
			{
				id: "l4",
				text: "Check off items as you complete them",
				completed: false,
			},
			{
				id: "l5",
				text: "Long press any list to select and delete",
				completed: false,
			},
			{ id: "l6", text: "Edit lists by tapping on them", completed: false },
		],
		date: new Date("2026-01-04T09:30:00"),
	},
];

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
	const [lists, setLists] = useState<List[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load lists from AsyncStorage on mount
	useEffect(() => {
		// Uncomment the line below to reset and see sample lists
		AsyncStorage.removeItem(STORAGE_KEY).then(() => loadLists());
		loadLists();
	}, []);

	// Save lists to AsyncStorage whenever they change
	useEffect(() => {
		if (isInitialized) {
			saveLists();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [lists, isInitialized]);

	const loadLists = async () => {
		try {
			const storedLists = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedLists) {
				const parsedLists = JSON.parse(storedLists);

				// If storage exists but is empty, initialize with sample lists
				if (parsedLists.length === 0) {
					setLists(SAMPLE_LISTS);
					setIsInitialized(true);
					return;
				}

				// Convert date strings back to Date objects
				const listsWithDates = parsedLists.map((list: any) => ({
					...list,
					date: new Date(list.date),
				}));

				setLists(listsWithDates);
				setIsInitialized(true);
			} else {
				// First run - no storage exists, add sample lists
				setLists(SAMPLE_LISTS);
				setIsInitialized(true);
			}
		} catch (error) {
			console.error("Error loading lists:", error);
			// On error, still initialize with sample lists
			setLists(SAMPLE_LISTS);
			setIsInitialized(true);
		}
	};

	const saveLists = async () => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
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

	const deleteMultipleLists = (ids: string[]) => {
		setLists(lists.filter((list) => !ids.includes(list.id)));
	};

	const getListById = (id: string): List | undefined => {
		return lists.find((list) => list.id === id);
	};

	const replaceAll = (newLists: List[]) => {
		setLists(newLists ?? []);
		setIsInitialized(true);
	};

	return (
		<ListContext.Provider
			value={{
				lists,
				addList,
				updateList,
				deleteList,
				deleteMultipleLists,
				getListById,
				replaceAll,
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
