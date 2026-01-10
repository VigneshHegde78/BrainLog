import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const STORAGE_KEY = "@brainlog_notes"; // Legacy fallback; context-driven by default

// 1. EXPORT (BACKUP)
type BackupPayload = {
	notes: any[];
	trash: any[];
	lists?: any[];
	tasks?: any[];
};

export const exportData = async (payload?: BackupPayload) => {
	try {
		// Prefer in-memory context data; fallback to legacy AsyncStorage
		let dataString: string | null = null;
		if (payload && Array.isArray(payload.notes)) {
			const backup = {
				version: 1,
				createdAt: new Date().toISOString(),
				notes: payload.notes,
				trash: payload.trash ?? [],
				lists: payload.lists ?? [],
				tasks: payload.tasks ?? [],
			};
			dataString = JSON.stringify(backup);
		} else {
			// Fallback: legacy notes-only
			const legacyNotes = await AsyncStorage.getItem(STORAGE_KEY);
			const legacyLists = await AsyncStorage.getItem("@lists");
			const legacyTasks = await AsyncStorage.getItem("@tasks");
			const backup = {
				version: 1,
				createdAt: new Date().toISOString(),
				notes: legacyNotes ? JSON.parse(legacyNotes) : [],
				trash: [],
				lists: legacyLists ? JSON.parse(legacyLists) : [],
				tasks: legacyTasks ? JSON.parse(legacyTasks) : [],
			};
			dataString = JSON.stringify(backup);
		}

		if (!dataString || dataString === "[]") {
			Alert.alert("Empty", "No notes to backup.");
			return;
		}

		// Where to save the file (prefer Documents, fallback to Cache)
		const dir: Directory | undefined = Paths.document ?? Paths.cache;
		if (!dir) {
			Alert.alert("Error", "No writable directory available on this platform.");
			return;
		}

		const file = new File(dir, "brainlog_backup.json");
		// Write data to that file
		file.write(dataString, { encoding: "utf8" });

		// Share it (User picks Drive, Email, Files, etc.)
		if (!(await Sharing.isAvailableAsync())) {
			Alert.alert(
				"Sharing Unavailable",
				"Backup saved to a temporary file, but this device cannot open the share sheet."
			);
			return;
		}
		await Sharing.shareAsync(file.uri, {
			mimeType: "application/json",
			dialogTitle: "Backup your BrainLog Notes",
			UTI: "public.json",
		});
	} catch (error) {
		Alert.alert("Error", "Failed to create backup.");
		console.error(error);
	}
};

// 2. IMPORT (RESTORE)
export const importData = async (
	onSuccess: () => void,
	onApply?: (payload: BackupPayload) => void
) => {
	try {
		// Open File Picker
		const result = await DocumentPicker.getDocumentAsync({
			type: "application/json", // Only allow JSON files
			copyToCacheDirectory: true,
		});

		if (result.canceled) return;

		const file = result.assets[0];

		// Read the file content
		const fileContent = await new File(file.uri).text();

		// simple validation check
		let parsed: any;
		try {
			parsed = JSON.parse(fileContent);
		} catch {
			Alert.alert("Error", "Invalid backup file.");
			return;
		}

		// Accept both legacy array and new object shape
		const restorePayload: BackupPayload = Array.isArray(parsed)
			? { notes: parsed, trash: [], lists: [], tasks: [] }
			: {
					notes: parsed.notes ?? [],
					trash: parsed.trash ?? [],
					lists: parsed.lists ?? [],
					tasks: parsed.tasks ?? [],
				};

		// WARNING: This overwrites current data
		Alert.alert(
			"Restore Backup?",
			"This will replace all current notes. This cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Restore",
					style: "destructive",
					onPress: async () => {
						// Persist legacy for compatibility (optional)
						await Promise.all([
							AsyncStorage.setItem(
								STORAGE_KEY,
								JSON.stringify(restorePayload.notes)
							),
							AsyncStorage.setItem(
								"@lists",
								JSON.stringify(restorePayload.lists ?? [])
							),
							AsyncStorage.setItem(
								"@tasks",
								JSON.stringify(restorePayload.tasks ?? [])
							),
						]);
						// Apply to in-memory state when provided
						onApply?.(restorePayload);
						Alert.alert("Success", "Notes restored! Reloading...");
						onSuccess();
					},
				},
			]
		);
	} catch (error) {
		Alert.alert("Error", "Failed to restore backup.");
		console.error(error);
	}
};
