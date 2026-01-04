import { NativeModules, Platform } from "react-native";

const LINKING_ERROR = `The package 'react-native-brainlog-widgets' doesn't seem to be installed and linked properly.`;

const BrainLogWidgets =
	Platform.OS === "android"
		? NativeModules.BrainLogWidgets ||
			new Proxy(
				{},
				{
					get() {
						throw new Error(LINKING_ERROR);
					},
				}
			)
		: {};

export interface WidgetUpdateData {
	notes?: { id: string; title: string; content: string }[];
	tasks?: { id: string; title: string; completed: boolean }[];
}

/**
 * Update homescreen widgets with latest data
 * Call this whenever notes or tasks change
 */
export const updateWidgets = async (data: WidgetUpdateData) => {
	if (Platform.OS !== "android") {
		console.log("Widgets are only available on Android");
		return;
	}

	try {
		if (data.notes) {
			await BrainLogWidgets.updateNotesWidget(JSON.stringify(data.notes));
		}
		if (data.tasks) {
			await BrainLogWidgets.updateTasksWidget(JSON.stringify(data.tasks));
		}
	} catch (error) {
		console.error("Error updating widgets:", error);
	}
};

/**
 * Refresh all widgets
 */
export const refreshAllWidgets = async () => {
	if (Platform.OS !== "android") return;

	try {
		await BrainLogWidgets.refreshAllWidgets();
	} catch (error) {
		console.error("Error refreshing widgets:", error);
	}
};

export default BrainLogWidgets;
