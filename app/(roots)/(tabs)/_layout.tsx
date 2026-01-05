import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const router = useRouter();
	const pathname = usePathname();
	const { colors, toggleTheme, isDark } = useTheme();

	const NavCapsule = ({ label, route }: { label: string; route: any }) => {
		const isActive = pathname.includes(route);
		return (
			<TouchableOpacity
				onPress={() => router.push(route)}
				onLongPress={() =>
					route === "/notes" ? router.push("/(roots)/private-auth") : null
				}
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
			<View className="h-0.5 w-full my-2 bg-gray-500" />
			<View className="p-4 justify-between flex-row items-center">
				<Text className="text-4xl text-[#ef4444] font-serif font-semibold">
					{pathname.replace(/\//g, "").replace(/^\w/, (c) => c.toUpperCase())}
					<Text className="font-serif text-sm" style={{ color: colors.text }}>
						&ensp;BrainLog
					</Text>
				</Text>
				<View className="flex-row gap-4">
					<TouchableOpacity>
						<MaterialIcons
							name={isDark ? "dark-mode" : "light-mode"}
							size={28}
							color="red"
							onPress={toggleTheme}
						/>
					</TouchableOpacity>
					<TouchableOpacity onPress={() => router.push("/deleted")}>
						<MaterialIcons name="delete-outline" size={28} color="red" />
					</TouchableOpacity>
				</View>
			</View>

			{/* Navigation */}
			<View className="flex-row justify-around items-center pt-2 px-2 pb-4">
				<NavCapsule label="Notes" route="/notes" />
				<NavCapsule label="Tasks" route="/tasks" />
				<NavCapsule label="Lists" route="/lists" />
			</View>

			{/* Content Area */}
			<View className="flex-1 relative">
				{/* 'relative' ensures children using absolute positioning stay inside this box */}
				<Slot />
			</View>

			<TouchableOpacity
				className="w-full justify-center items-center"
				onPress={() => router.push("https://github.com/vhx")}
			>
				<Text
					className="font-serif text-xs font-bold"
					style={{ color: colors.text }}
				>
					Made with ❤️ by Vignesh.
				</Text>
			</TouchableOpacity>

			{/* DELETED THE FAB FROM HERE */}
		</SafeAreaView>
	);
}
