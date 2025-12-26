import { MaterialIcons } from "@expo/vector-icons";
import { Slot, usePathname, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
	const router = useRouter();
	const pathname = usePathname(); // Gets the current route (e.g., "/notes")

	// Reusable Capsule Component
	const NavCapsule = ({ label, route }: { label: string; route: any }) => {
		// Check if this capsule matches the current active route
		// We use .includes because pathname might be "/notes/edit", which should still highlight "/notes"
		const isActive = pathname.includes(route);

		return (
			<TouchableOpacity
				onPress={() => router.push(route)}
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
			<View className="h-0.5 w-full my-3 bg-gray-500" />
			<View className=" p-4 justify-between flex-row items-center">
				<Text className="text-4xl text-white font-serif">
					{pathname.replace(/\//g, "").replace(/^\w/, (c) => c.toUpperCase())}
					<Text className="text-white font-serif text-sm ">&ensp;BrainLog</Text>
				</Text>

				<MaterialIcons name="delete-outline" size={28} color="red" />
			</View>
			{/* 1. Fixed Top Navigation Bar */}
			<View className="flex-row justify-around items-center pt-2 px-2 pb-4">
				<NavCapsule label="Notes" route="/notes" />
				<NavCapsule label="Task" route="/tasks" />
				<NavCapsule label="List" route="/lists" />
			</View>

			{/* 2. The Children (Screen Content) */}
			{/* <Slot /> renders the component for the current route (notes.tsx, task.tsx, etc.) */}
			<View className="flex-1">
				<Slot />
			</View>

			<TouchableOpacity
				onPress={() => null}
				className="bg-red-500 w-16 h-16 rounded-full items-center justify-center shadow-lg absolute bottom-8 right-8"
			>
				<MaterialIcons name="add" size={32} color="white" />
			</TouchableOpacity>
		</SafeAreaView>
	);
}
