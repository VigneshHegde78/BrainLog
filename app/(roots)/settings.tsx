import { useList } from "@/context/ListContext";
import { useNotes } from "@/context/NoteContext";
import { useTasks } from "@/context/TaskContext";
import { useTheme } from "@/context/ThemeContext";
import { exportData, importData } from "@/src/utils/backup";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
	ActivityIndicator,
	Linking,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
	const router = useRouter();
	const { colors, isDark, toggleTheme } = useTheme();
	const { notes, trash, replaceAll } = useNotes();
	const { lists, replaceAll: replaceLists } = useList();
	const { tasks, replaceAll: replaceTasks } = useTasks();
	const [isBackingUp, setIsBackingUp] = React.useState(false);
	const [isRestoring, setIsRestoring] = React.useState(false);

	// Function to reload app/nav to Home after import
	const handleReload = () => {
		// In Expo Router, replacing to home forces a refresh of data hooks usually
		router.replace("/notes");
	};

	const SettingsItem = ({
		label,
		icon,
		subtext,
		onPress,
		danger = false,
		loading = false,
	}: any) => (
		<TouchableOpacity
			onPress={onPress}
			className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700"
			style={{ backgroundColor: colors.background }}
		>
			<View
				className="p-3 rounded-full"
				style={{ backgroundColor: colors.card }}
			>
				<MaterialIcons name={icon} size={24} color={colors.tint} />
			</View>
			<View className="ml-4 flex-1">
				<Text className="text-lg font-semibold" style={{ color: colors.text }}>
					{label}
				</Text>
				{subtext && <Text className="text-gray-500 text-sm">{subtext}</Text>}
			</View>
			{loading && <ActivityIndicator size="small" color={colors.text} />}
		</TouchableOpacity>
	);

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: colors.background }}
		>
			{/* Custom Header */}
			<View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
				<TouchableOpacity onPress={() => router.back()}>
					<MaterialIcons name="arrow-back" size={24} color={colors.tint} />
				</TouchableOpacity>
				<Text className="text-xl font-bold ml-4" style={{ color: colors.tint }}>
					Settings
				</Text>
			</View>

			<ScrollView>
				<Text className="p-4 text-blue-500 font-bold uppercase text-xs">
					App & Data
				</Text>

				<SettingsItem
					label="Guides & Help"
					subtext="Learn app features at a glance"
					icon="help-outline"
					onPress={() => {
						router.push("/help");
					}}
				/>

				{/* Reordered for clearer flow: Guides → Backup → Restore → Deleted → Theme */}
				<SettingsItem
					label="Backup Data"
					subtext="Save a JSON file to your device/cloud"
					icon="file-upload"
					loading={isBackingUp}
					onPress={async () => {
						if (isBackingUp) return;
						setIsBackingUp(true);
						try {
							await exportData({ notes, trash, lists, tasks });
						} finally {
							setIsBackingUp(false);
						}
					}}
				/>

				<SettingsItem
					label="Restore Backup"
					subtext="Import data from a JSON file"
					icon="file-download"
					loading={isRestoring}
					onPress={async () => {
						if (isRestoring) return;
						setIsRestoring(true);
						try {
							await importData(handleReload, (payload) => {
								replaceAll(payload.notes, payload.trash);
								replaceLists(payload.lists ?? []);
								replaceTasks(payload.tasks ?? []);
							});
						} finally {
							setIsRestoring(false);
						}
					}}
				/>

				<SettingsItem
					label="Deleted Notes"
					subtext="View and manage recently deleted notes"
					icon="delete-outline"
					onPress={() => {
						router.push("/deleted");
					}}
				/>

				<SettingsItem
					label={isDark ? "Light Mode" : "Dark Mode"}
					subtext="Toggle app theme"
					icon={isDark ? "light-mode" : "dark-mode"}
					onPress={toggleTheme}
				/>

				{/* Single group header keeps UI minimal; remove extra section headings */}

				{/* Optional: Add a 'Delete All' button here later */}
				<SettingsItem
					label="About Brain.log"
					subtext="Version 1.0.0"
					icon="info-outline"
					onPress={() => {}}
				/>

				<SettingsItem
					label="Vignesh Hegde"
					subtext="Visit GitHub"
					icon="code"
					onPress={() => {
						Linking.openURL("https://github.com/VigneshHegde78");
					}}
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
