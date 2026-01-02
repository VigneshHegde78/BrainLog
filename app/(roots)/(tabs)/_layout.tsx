import { MaterialIcons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const router = useRouter();
	const pathname = usePathname();

	const NavCapsule = ({ label, route }: { label: string; route: any }) => {
		const isActive = pathname.includes(route);
		return (
			<TouchableOpacity
				onPress={() => router.push(route)}
				onLongPress={() =>
					route === "/notes" ? router.push("/(roots)/private-auth") : null
				}
				className={`w-28 h-10 flex-row items-center justify-center rounded-full ${
					isActive ? "bg-red-500" : "bg-white"
				}`}
			>
				<Text
					className={`text-base font-semibold ${
						isActive ? "text-black" : "text-gray-900"
					}`}
				>
					{label}
				</Text>
			</TouchableOpacity>
		);
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			{/* Header Area */}
			<View className="h-0.5 w-full my-2 bg-gray-500" />
			<View className="p-4 justify-between flex-row items-center">
				<Text className="text-4xl text-[#ef4444] font-serif font-semibold">
					{pathname.replace(/\//g, "").replace(/^\w/, (c) => c.toUpperCase())}
					<Text className="text-white font-serif text-sm ">&ensp;BrainLog</Text>
				</Text>
				<TouchableOpacity onPress={() => router.push("/deleted")}>
					<MaterialIcons name="delete-outline" size={28} color="red" />
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
				{/* 'relative' ensures children using absolute positioning stay inside this box */}
				<Slot />
			</View>

			{/* DELETED THE FAB FROM HERE */}
		</SafeAreaView>
	);
}
