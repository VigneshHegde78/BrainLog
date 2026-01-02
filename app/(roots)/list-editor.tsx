import { useList } from "@/context/ListContext";
import { ListItem } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Alert,
	Keyboard,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ListEditor() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { addList, updateList, deleteList, getListById } = useList();

	const [title, setTitle] = useState("");
	const [items, setItems] = useState<ListItem[]>([]);
	const [newItemText, setNewItemText] = useState("");

	// Load existing list if editing
	useEffect(() => {
		if (id && typeof id === "string") {
			const existingList = getListById(id);
			if (existingList) {
				setTitle(existingList.title);
				setItems(existingList.items);
			}
		}
	}, [id]);

	const handleAddItem = () => {
		if (newItemText.trim()) {
			const newItem: ListItem = {
				id: Date.now().toString(),
				text: newItemText.trim(),
				completed: false,
			};
			setItems([...items, newItem]);
			setNewItemText("");
			Keyboard.dismiss();
		}
	};

	const handleToggleItem = (itemId: string) => {
		setItems(
			items.map((item) =>
				item.id === itemId ? { ...item, completed: !item.completed } : item
			)
		);
	};

	const handleDeleteItem = (itemId: string) => {
		setItems(items.filter((item) => item.id !== itemId));
	};

	const handleSave = () => {
		if (!title.trim() && items.length === 0) {
			Alert.alert("Empty List", "Please add a title or at least one item");
			return;
		}

		if (id && typeof id === "string") {
			updateList(id, title, items);
		} else {
			addList(title, items);
		}
		router.back();
	};

	const handleDelete = () => {
		if (id && typeof id === "string") {
			Alert.alert("Delete List", "Are you sure you want to delete this list?", [
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						deleteList(id);
						router.back();
					},
				},
			]);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			{/* Header */}
			<View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-800">
				<TouchableOpacity onPress={() => router.back()}>
					<MaterialIcons name="arrow-back" size={24} color="#fff" />
				</TouchableOpacity>

				<View className="flex-row items-center gap-4">
					{id && (
						<TouchableOpacity onPress={handleDelete}>
							<MaterialIcons name="delete" size={24} color="#ef4444" />
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={handleSave}>
						<MaterialIcons name="check" size={24} color="#10b981" />
					</TouchableOpacity>
				</View>
			</View>

			<ScrollView className="flex-1 p-4">
				{/* Title Input */}
				<TextInput
					className="text-white text-2xl font-bold mb-6"
					placeholder="List Title"
					placeholderTextColor="#71717a"
					value={title}
					onChangeText={setTitle}
					multiline
				/>

				{/* Items List */}
				<View className="mb-6">
					{items.map((item) => (
						<View
							key={item.id}
							className="flex-row items-center bg-zinc-900 p-3 rounded-2xl mb-2"
						>
							<TouchableOpacity onPress={() => handleToggleItem(item.id)}>
								<MaterialIcons
									name={
										item.completed ? "check-box" : "check-box-outline-blank"
									}
									size={24}
									color={item.completed ? "#10b981" : "#71717a"}
								/>
							</TouchableOpacity>

							<Text
								className="flex-1 text-white text-base ml-3"
								style={{
									textDecorationLine: item.completed ? "line-through" : "none",
									opacity: item.completed ? 0.5 : 1,
								}}
							>
								{item.text}
							</Text>

							<TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
								<MaterialIcons name="close" size={20} color="#71717a" />
							</TouchableOpacity>
						</View>
					))}
				</View>

				{/* Add New Item */}
				<View className="flex-row items-center bg-zinc-900 rounded-2xl px-4 py-2">
					<MaterialIcons name="add" size={24} color="#71717a" />
					<TextInput
						className="flex-1 text-white text-base ml-3"
						placeholder="Add item..."
						placeholderTextColor="#71717a"
						value={newItemText}
						onChangeText={setNewItemText}
						onSubmitEditing={handleAddItem}
						returnKeyType="done"
					/>
					{newItemText.trim() && (
						<TouchableOpacity onPress={handleAddItem}>
							<MaterialIcons name="send" size={20} color="#10b981" />
						</TouchableOpacity>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
