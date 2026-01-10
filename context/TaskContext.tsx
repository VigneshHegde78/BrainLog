import { Task } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TaskContextType {
	tasks: Task[];
	addTask: (task: Task) => void;
	updateTask: (id: string, updates: Partial<Task>) => void;
	deleteTask: (id: string) => void;
	deleteMultipleTasks: (ids: string[]) => void;
	toggleTaskCompletion: (id: string) => void;
	replaceAll: (tasks: Task[]) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const STORAGE_KEY = "@tasks";

const SAMPLE_TASKS: Task[] = [
	{
		id: "sample-task-1",
		title: "Click on + to Create a Task",
		completed: false,
	},
	{
		id: "sample-task-2",
		title: "Create a Task with a Reminder",
		completed: false,
	},
	{
		id: "sample-task-3",
		title: "Click on the Checkmark to mark the Task as Completed",
		completed: false,
	},
];

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	// Load tasks from AsyncStorage on mount
	useEffect(() => {
		loadTasks();
	}, []);

	// Save tasks to AsyncStorage whenever they change
	useEffect(() => {
		if (isInitialized) {
			saveTasks();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks, isInitialized]);

	const loadTasks = async () => {
		try {
			const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
			if (storedTasks) {
				const parsedTasks = JSON.parse(storedTasks);

				// If storage exists but is empty, initialize with sample tasks
				if (parsedTasks.length === 0) {
					setTasks(SAMPLE_TASKS);
					setIsInitialized(true);
					return;
				}

				setTasks(parsedTasks);
				setIsInitialized(true);
			} else {
				// First run - no storage exists, add sample tasks
				setTasks(SAMPLE_TASKS);
				setIsInitialized(true);
			}
		} catch (error) {
			console.error("Error loading tasks:", error);
			// On error, still initialize with sample tasks
			setTasks(SAMPLE_TASKS);
			setIsInitialized(true);
		}
	};

	const saveTasks = async () => {
		try {
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
		} catch (error) {
			console.error("Error saving tasks:", error);
		}
	};

	const addTask = (task: Task) => {
		setTasks([task, ...tasks]);
	};

	const updateTask = (id: string, updates: Partial<Task>) => {
		setTasks(
			tasks.map((task) => (task.id === id ? { ...task, ...updates } : task))
		);
	};

	const deleteTask = (id: string) => {
		setTasks(tasks.filter((task) => task.id !== id));
	};

	const deleteMultipleTasks = (ids: string[]) => {
		setTasks(tasks.filter((task) => !ids.includes(task.id)));
	};

	const toggleTaskCompletion = (id: string) => {
		setTasks(
			tasks.map((task) =>
				task.id === id ? { ...task, completed: !task.completed } : task
			)
		);
	};

	const replaceAll = (newTasks: Task[]) => {
		setTasks(newTasks ?? []);
		setIsInitialized(true);
	};

	return (
		<TaskContext.Provider
			value={{
				tasks,
				addTask,
				updateTask,
				deleteTask,
				deleteMultipleTasks,
				toggleTaskCompletion,
				replaceAll,
			}}
		>
			{children}
		</TaskContext.Provider>
	);
};

export const useTasks = () => {
	const context = useContext(TaskContext);
	if (!context) {
		throw new Error("useTasks must be used within a TaskProvider");
	}
	return context;
};
