import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Removed modal-based auth; Private screen handles its own auth

export default function RootLayout() {
	const router = useRouter();
	const pathname = usePathname();
	const { colors, isDark } = useTheme();

	// Long press on Notes navigates directly to Private;
	// Private screen will request auth once.
	const handleNotesLongPress = () => {
		router.push("/private");
	};

	// --- BELOW IS YOUR ORIGINAL APP CODE (Runs only after unlock) ---

	const NavCapsule = ({ label, route }: { label: string; route: any }) => {
		const isActive = pathname.includes(route);
		return (
			<TouchableOpacity
				onPress={() => router.replace(route)}
				onLongPress={() => (route === "/notes" ? handleNotesLongPress() : null)}
				className={`w-28 h-10 flex-row items-center justify-center rounded-full ${
					isActive ? "bg-red-500" : isDark ? "bg-white" : "bg-gray-700"
				}`}
			>
				<Text
					className={`text-base font-semibold ${
						isActive ? "text-black" : isDark ? "text-gray-900" : "text-gray-100"
					}`}
				>
					{label}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{ backgroundColor: colors.background }}
		>
			{/* Header Area */}
			<View className="h-0.5 w-full bg-gray-500" />
			<View className="p-4 justify-between flex-row items-center">
				<Text className="text-4xl text-[#ef4444] font-serif font-semibold">
					{pathname.replace(/\//g, "").replace(/^\w/, (c) => c.toUpperCase())}
					<Text className="font-serif text-sm" style={{ color: colors.text }}>
						&ensp;BrainLog
					</Text>
				</Text>

				<TouchableOpacity onPress={() => router.push("/settings")}>
					<MaterialIcons name="more-vert" size={28} color="red" />
				</TouchableOpacity>
			</View>

			{/* Navigation */}
			<View className="flex-row justify-around items-center pt-2 px-2 pb-4">
				<NavCapsule label="Notes" route="/notes" />
				<NavCapsule label="Tasks" route="/tasks" />
				<NavCapsule label="Lists" route="/lists" />
			</View>

			{/* Content Area */}
			<View className="flex-1 relative">
				<Slot />
			</View>

			<TouchableOpacity
				className="w-full justify-center items-center"
				onPress={() => Linking.openURL("https://github.com/VigneshHegde78")}
			>
				<Text
					className="font-serif text-xs font-bold mb-1"
					style={{ color: colors.text2 }}
				>
					Made with ❤️ by Vignesh.
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
