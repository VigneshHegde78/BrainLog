import { useList } from "@/context/ListContext";
import { List } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function DeletedLists() {
	const router = useRouter();
	const {
		trash,
		restoreList,
		restoreMultipleLists,
		permanentlyDelete,
		permanentlyDeleteMultiple,
	} = useList();
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedLists, setSelectedLists] = useState<string[]>([]);

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

	const handleLongPress = (id: string) => {
		setSelectionMode(true);
		setSelectedLists([id]);
	};

	const handleSelectList = (id: string) => {
		if (selectedLists.includes(id)) {
			setSelectedLists(selectedLists.filter((listId) => listId !== id));
		} else {
			setSelectedLists([...selectedLists, id]);
		}
	};

	const handleSelectAll = () => {
		if (selectedLists.length === trash.length) {
			setSelectedLists([]);
		} else {
			setSelectedLists(trash.map((list) => list.id));
		}
	};

	const handleDeleteSelected = () => {
		Alert.alert(
			"Delete Permanently?",
			`Delete ${selectedLists.length} lists permanently? This action cannot be undone.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						if (selectedLists.length > 0) {
							permanentlyDeleteMultiple(selectedLists);
							setSelectedLists([]);
							setSelectionMode(false);
						}
					},
				},
			]
		);
	};

	const handleRestoreSelected = () => {
		if (selectedLists.length > 0) {
			restoreMultipleLists(selectedLists);
			setSelectedLists([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedLists([]);
	};

	const renderListItem = ({ item }: { item: List }) => (
		<TouchableOpacity
			onPress={() => {
				if (selectionMode) {
					handleSelectList(item.id);
				}
			}}
			onLongPress={() => handleLongPress(item.id)}
			className="bg-zinc-900 p-4 rounded-2xl mb-3 flex-row justify-between items-center"
		>
			{/* Checkbox for selection mode */}
			{selectionMode && (
				<View className="mr-3">
					<View
						className={`w-6 h-6 rounded-full items-center justify-center ${
							selectedLists.includes(item.id)
								? "bg-red-500"
								: "bg-zinc-700 border-2 border-zinc-500"
						}`}
					>
						{selectedLists.includes(item.id) && (
							<MaterialIcons name="check" size={16} color="white" />
						)}
					</View>
				</View>
			)}
			<View className="flex-1 pr-4">
				<Text className="text-white font-bold text-lg mb-1" numberOfLines={1}>
					{item.title || "Untitled List"}
				</Text>
				<Text className="text-zinc-500 text-sm mb-2">
					{item.items.length} item{item.items.length !== 1 ? "s" : ""}
				</Text>
				<Text className="text-red-400 text-xs">
					Auto-deletes in {calculateDaysLeft(item.deletedAt)} days
				</Text>
			</View>

			{/* Action Buttons - Hide in selection mode */}
			{!selectionMode && (
				<View className="flex-row gap-3">
					{/* Restore Button */}
					<TouchableOpacity
						onPress={() => restoreList(item.id)}
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
			)}
		</TouchableOpacity>
	);

	return (
		<View className="flex-1 bg-black px-4 py-2">
			{/* Selection Mode Header */}
			{selectionMode && (
				<View className="flex-row items-center justify-between mb-3 bg-zinc-900 p-3 rounded-2xl">
					<TouchableOpacity onPress={handleCancelSelection}>
						<MaterialIcons name="close" size={24} color="white" />
					</TouchableOpacity>
					<Text className="text-white font-medium">
						{selectedLists.length} selected
					</Text>
					<View className="flex-row items-center gap-3">
						<TouchableOpacity onPress={handleSelectAll}>
							<MaterialIcons
								name={
									selectedLists.length === trash.length
										? "deselect"
										: "select-all"
								}
								size={24}
								color="white"
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleRestoreSelected}>
							<MaterialIcons name="restore" size={24} color="#10b981" />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleDeleteSelected}>
							<MaterialIcons name="delete-forever" size={24} color="#ef4444" />
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Header */}
			<View className="flex-row items-center justify-between mb-4">
				<TouchableOpacity onPress={() => router.back()}>
					<MaterialIcons name="arrow-back" size={28} color="white" />
				</TouchableOpacity>
				<Text className="text-white text-xl font-bold">Deleted Lists</Text>
				<View style={{ width: 28 }} />
			</View>

			{/* List */}
			<FlatList
				data={trash}
				renderItem={renderListItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={() => (
					<View className="flex-1 justify-center items-center mt-32">
						<MaterialIcons name="delete-outline" size={64} color="#3f3f46" />
						<Text className="text-gray-500 text-lg mt-4">No deleted lists</Text>
					</View>
				)}
			/>
		</View>
	);
}
