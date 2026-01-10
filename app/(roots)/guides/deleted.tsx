import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuidesDeleted() {
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
					Deleted Guide
				</Text>
			</View>
			<ScrollView>
				<Step
					title="Find deleted"
					desc="Open Deleted section to see items kept for 30 days."
				/>
				<Step title="Restore" desc="Tap restore to move back to Notes." />
				<Step
					title="Delete permanently"
					desc="Use delete to remove an item permanently (cannot be undone)."
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
