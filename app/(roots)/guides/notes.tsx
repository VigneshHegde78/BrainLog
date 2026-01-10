import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuidesNotes() {
	const router = useRouter();
	const { colors } = useTheme();

	const Step = ({ title, desc }: { title: string; desc: string }) => (
		<View
			className="p-4 border-b border-gray-200 dark:border-gray-700"
			style={{ backgroundColor: colors.background }}
		>
			<Text className="text-base font-semibold" style={{ color: colors.tint }}>
				{title}
			</Text>
			<Text className="text-sm mt-1" style={{ color: colors.text }}>
				{desc}
			</Text>
		</View>
	);

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: colors.background }}
		>
			<View className="flex-row items-center p-4 border-b border-gray-200 dark:border-gray-700">
				<TouchableOpacity onPress={() => router.back()}>
					<MaterialIcons name="arrow-back" size={24} color={colors.text} />
				</TouchableOpacity>
				<Text className="text-xl font-bold ml-4" style={{ color: colors.text }}>
					Notes Guide
				</Text>
			</View>
			<ScrollView>
				<Step
					title="Create a note"
					desc="Open Notes tab > tap + > add title & content > save."
				/>
				<Step
					title="Tagging"
					desc="Use #tags in content to organize and filter later."
				/>
				<Step
					title="Edit a note"
					desc="Open a note > modify content/title > changes auto-save or tap save."
				/>
				<Step
					title="Search"
					desc="Use the search bar at the top to find notes by text or tags."
				/>
				<Step
					title="Delete & Restore"
					desc="Delete moves the note to Deleted. Restore it within 30 days or delete permanently."
				/>
				<Step
					title="Mark Private"
					desc="Use the lock toggle in the editor or add #private/#secret to mark as private."
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
