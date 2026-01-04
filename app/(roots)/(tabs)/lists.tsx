import { FloatingButton } from "@/components/FloatingButton";
import { useList } from "@/context/ListContext";
import { List } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ListScreen() {
	const { lists, deleteMultipleLists } = useList();
	const router = useRouter();
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedLists, setSelectedLists] = useState<string[]>([]);

	// Split into two columns for the masonry layout
	const leftColumn = lists.filter((_, i) => i % 2 === 0);
	const rightColumn = lists.filter((_, i) => i % 2 !== 0);

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
		if (selectedLists.length === lists.length) {
			setSelectedLists([]);
		} else {
			setSelectedLists(lists.map((list) => list.id));
		}
	};

	const handleDeleteSelected = () => {
		if (selectedLists.length > 0) {
			deleteMultipleLists(selectedLists);
			setSelectedLists([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedLists([]);
	};

	// Reusable Card Component
	const ListCard = ({ item }: { item: List }) => {
		const isSelected = selectedLists.includes(item.id);
		return (
			<TouchableOpacity
				key={item.id}
				className="bg-zinc-900 p-5 rounded-3xl mb-3 overflow-hidden"
				style={{
					minHeight: 50,
					maxHeight: 210,
				}}
				onPress={() => {
					if (selectionMode) {
						handleSelectList(item.id);
					} else {
						router.push(`/list-editor?id=${item.id}`);
					}
				}}
				onLongPress={() => handleLongPress(item.id)}
				activeOpacity={0.7}
			>
				{selectionMode && (
					<View className="absolute top-3 right-3 z-10">
						<MaterialIcons
							name={isSelected ? "check-circle" : "radio-button-unchecked"}
							size={24}
							color={isSelected ? "#10b981" : "#71717a"}
						/>
					</View>
				)}
				<Text className="text-gray-200 text-base font-medium whitespace-pre-wrap leading-6">
					{item.title || "Untitled List"}
				</Text>

				<View className="mt-3">
					{item.items && item.items.length > 0 ? (
						item.items.slice(0, 5).map((listItem) => (
							<View key={listItem.id} className="flex-row items-center mt-1">
								<MaterialIcons
									name={
										listItem.completed ? "check-box" : "check-box-outline-blank"
									}
									size={16}
									color={listItem.completed ? "#10b981" : "#71717a"}
								/>
								<Text
									className="text-gray-400 text-sm leading-5 ml-2"
									style={{
										textDecorationLine: listItem.completed
											? "line-through"
											: "none",
										opacity: listItem.completed ? 0.5 : 1,
									}}
								>
									{listItem.text}
								</Text>
							</View>
						))
					) : (
						<Text className="text-gray-500 text-sm italic">No items yet</Text>
					)}
					{item.items.length > 5 && (
						<Text className="text-gray-500 text-xs mt-2">
							+{item.items.length - 5} more items
						</Text>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View className="flex-1 bg-black p-4 relative">
			{/* Selection Mode Header */}
			{selectionMode && (
				<View className="flex-row items-center justify-between mb-4 bg-zinc-900 p-3 rounded-2xl">
					<TouchableOpacity onPress={handleCancelSelection}>
						<MaterialIcons name="close" size={24} color="#fff" />
					</TouchableOpacity>
					<Text className="text-white font-medium">
						{selectedLists.length} selected
					</Text>
					<View className="flex-row items-center gap-3">
						<TouchableOpacity onPress={handleSelectAll}>
							<MaterialIcons
								name={
									selectedLists.length === lists.length
										? "deselect"
										: "select-all"
								}
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleDeleteSelected}>
							<MaterialIcons name="delete" size={24} color="#ef4444" />
						</TouchableOpacity>
					</View>
				</View>
			)}

			{lists.length === 0 ? (
				<View className="flex-1 justify-center items-center">
					<MaterialIcons name="list-alt" size={64} color="#3f3f46" />
					<Text className="text-gray-500 text-lg mt-4">No lists yet</Text>
					<Text className="text-gray-600 text-sm mt-2">
						Tap + to create your first list
					</Text>
				</View>
			) : (
				<ScrollView
					contentContainerStyle={{
						flexDirection: "row",
						justifyContent: "space-between",
						paddingBottom: 100,
					}}
				>
					{/* Left column */}
					<View style={{ width: "48%" }}>
						{leftColumn.map((item) => (
							<ListCard key={item.id} item={item} />
						))}
					</View>

					{/* Right column */}
					<View style={{ width: "48%" }}>
						{rightColumn.map((item) => (
							<ListCard key={item.id} item={item} />
						))}
					</View>
				</ScrollView>
			)}

			<FloatingButton onPress={() => router.push("/list-editor")} />
		</View>
	);
}
