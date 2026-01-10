import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Guides() {
	const router = useRouter();
	const { colors } = useTheme();

	const Row = ({
		icon,
		title,
		desc,
		to,
	}: {
		icon: any;
		title: string;
		desc: string;
		to: string;
	}) => (
		<TouchableOpacity
			onPress={() => router.push(to as any)}
			className="flex-row items-start p-4 border-b border-gray-200 dark:border-gray-700"
			style={{ backgroundColor: colors.background }}
		>
			<View
				className="p-3 rounded-full"
				style={{ backgroundColor: colors.card }}
			>
				<MaterialIcons name={icon} size={22} color={colors.text} />
			</View>
			<View className="ml-4 flex-1">
				<Text
					className="text-base font-semibold"
					style={{ color: colors.tint }}
				>
					{title}
				</Text>
				<Text className="text-sm mt-1" style={{ color: colors.text }}>
					{desc}
				</Text>
				<Text className="text-xs mt-2" style={{ color: colors.text }}>
					Tap to view steps
				</Text>
			</View>
			<MaterialIcons name="chevron-right" size={22} color={colors.text} />
		</TouchableOpacity>
	);

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: colors.background }}
		>
			{/* Header */}
			<View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
				<TouchableOpacity onPress={() => router.back()}>
					<MaterialIcons name="arrow-back" size={24} color={colors.text} />
				</TouchableOpacity>
				<Text className="text-xl font-bold ml-4" style={{ color: colors.text }}>
					Guides & Help
				</Text>
			</View>

			<ScrollView>
				<Text className="p-4 text-blue-500 font-bold uppercase text-xs">
					Overview
				</Text>

				<Row
					icon="note-add"
					title="Notes"
					desc="Tap + to create, add a title & content, use #tags to organize. Long-press to multi-select; search at top."
					to="/guides/notes"
				/>
				<Row
					icon="lock-outline"
					title="Private Notes"
					desc="Open Private tab, authenticate, then tap +. You can also mark any note private via the editor toggle or #private tag."
					to="/guides/private"
				/>
				<Row
					icon="delete-outline"
					title="Deleted"
					desc="Find items deleted in the last 30 days. Tap restore to recover; use delete to remove permanently."
					to="/guides/deleted"
				/>
				<Row
					icon="checklist"
					title="Lists"
					desc="Tap + to create a list, add items, edit titles, and check off items as done. Long-press to reorder or remove."
					to="/guides/lists"
				/>
				<Row
					icon="task"
					title="Tasks"
					desc="Tap + to add a task. Tap the checkmark to toggle complete; edit details from the task view."
					to="/guides/tasks"
				/>
				<Row
					icon="backup"
					title="Backup & Restore"
					desc="Settings → Backup Data to export JSON via share sheet. Use Restore Backup to import a file and rehydrate data."
					to="/guides/backup"
				/>
				<Row
					icon="dark-mode"
					title="Theme"
					desc="Toggle Dark/Light mode from Settings for a comfortable reading experience."
					to="/guides/theme"
				/>
				<Row
					icon="security"
					title="Security"
					desc="Enable PIN/biometrics (where available) to protect private content and sensitive actions."
					to="/guides/security"
				/>

				<View className="p-4">
					<Text className="text-xs" style={{ color: colors.text }}>
						Tip: Use the + button in each tab to quickly add content. Long-press
						items to multi-select and manage in bulk.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
