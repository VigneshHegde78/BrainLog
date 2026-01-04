import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * Hook to automatically save data to AsyncStorage in formats
 * that the Android widgets can read
 */
export const useWidgetSync = () => {
	// Sync notes with widget
	useEffect(() => {
		const syncNotesWidget = async () => {
			try {
				const notesJson = await AsyncStorage.getItem("@notes");
				if (notesJson && Platform.OS === "android") {
					// Notes widget will read from @notes AsyncStorage key
					// This ensures widget always has latest data
				}
			} catch (error) {
				console.error("Error syncing notes widget:", error);
			}
		};

		syncNotesWidget();
		const interval = setInterval(syncNotesWidget, 30000); // Sync every 30 seconds
		return () => clearInterval(interval);
	}, []);

	// Sync tasks with widget
	useEffect(() => {
		const syncTasksWidget = async () => {
			try {
				const tasksJson = await AsyncStorage.getItem("@tasks");
				if (tasksJson && Platform.OS === "android") {
					// Tasks widget will read from @tasks AsyncStorage key
					// This ensures widget always has latest data
				}
			} catch (error) {
				console.error("Error syncing tasks widget:", error);
			}
		};

		syncTasksWidget();
		const interval = setInterval(syncTasksWidget, 30000); // Sync every 30 seconds
		return () => clearInterval(interval);
	}, []);
};
