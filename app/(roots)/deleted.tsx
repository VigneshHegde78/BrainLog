import { useNotes } from "@/context/NoteContext"; // Import context
import { Note } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function RecentlyDeleted() {
	const { trash, restoreNote, permanentlyDelete } = useNotes();

	const calculateDaysLeft = (deletedDate?: Date) => {
		if (!deletedDate) return 30;
		const now = new Date();
		const deletedAt = new Date(deletedDate);
		const diffTime = Math.abs(now.getTime() - deletedAt.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return 30 - diffDays;
	};

	const confirmDelete = (id: string) => {
		Alert.alert("Delete Permanently?", "This action cannot be undone.", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Delete",
				style: "destructive",
				onPress: () => permanentlyDelete(id),
			},
		]);
	};

	const renderTrashItem = ({ item }: { item: Note }) => (
		<View className="bg-zinc-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center">
			<View className="flex-1 pr-4">
				<Text className="text-white font-bold text-lg mb-1" numberOfLines={1}>
					{item.title}
				</Text>
				<Text className="text-zinc-500 text-sm mb-2" numberOfLines={1}>
					{item.content}
				</Text>
				<Text className="text-red-400 text-xs">
					Auto-deletes in {calculateDaysLeft(item.deletedAt)} days
				</Text>
			</View>

			<View className="flex-row gap-3">
				{/* Restore Button */}
				<TouchableOpacity
					onPress={() => restoreNote(item.id)}
					className="bg-zinc-800 w-10 h-10 rounded-full items-center justify-center"
				>
					<MaterialIcons name="restore" size={22} color="white" />
				</TouchableOpacity>

				{/* Permanent Delete Button */}
				<TouchableOpacity
					onPress={() => confirmDelete(item.id)}
					className="bg-zinc-800 w-10 h-10 rounded-full items-center justify-center"
				>
					<MaterialIcons name="delete-forever" size={22} color="#ef4444" />
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<View className="flex-1 bg-black px-4 py-2">
			<View className="flex-row items-center justify-between mb-4">
				<Text className="text-zinc-500 text-sm">
					Notes are permanently removed after 29 days.
				</Text>
				<Text className="text-zinc-600 text-sm font-bold">
					{trash.length} Notes
				</Text>
			</View>

			<FlatList
				data={trash}
				keyExtractor={(item) => item.id}
				renderItem={renderTrashItem}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
				ListEmptyComponent={() => (
					<View className="mt-20 items-center justify-center">
						<MaterialIcons name="delete-outline" size={64} color="#3f3f46" />
						<Text className="text-zinc-600 text-lg mt-4 font-medium">
							Trash is empty
						</Text>
					</View>
				)}
			/>
		</View>
	);
}
