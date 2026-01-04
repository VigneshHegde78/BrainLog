import { Task } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function DeletedTasks() {
	const router = useRouter();
	const [allTasks, setAllTasks] = useState<Task[]>([]);
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

	// Get deleted tasks
	const deletedTasks = allTasks.filter((t) => t.deletedAt);

	const calculateDaysLeft = (deletedDate?: Date) => {
		if (!deletedDate) return 30;
		const now = new Date();
		const deletedAt = new Date(deletedDate);
		const diffTime = Math.abs(now.getTime() - deletedAt.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return 30 - diffDays;
	};

	const restoreTask = (id: string) => {
		setAllTasks(
			allTasks.map((task) =>
				task.id === id ? { ...task, deletedAt: undefined } : task
			)
		);
	};

	const permanentlyDelete = (id: string) => {
		setAllTasks(allTasks.filter((task) => task.id !== id));
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
		setSelectedTasks([id]);
	};

	const handleSelectTask = (id: string) => {
		if (selectedTasks.includes(id)) {
			setSelectedTasks(selectedTasks.filter((taskId) => taskId !== id));
		} else {
			setSelectedTasks([...selectedTasks, id]);
		}
	};

	const handleSelectAll = () => {
		if (selectedTasks.length === deletedTasks.length) {
			setSelectedTasks([]);
		} else {
			setSelectedTasks(deletedTasks.map((task) => task.id));
		}
	};

	const handleDeleteSelected = () => {
		Alert.alert(
			"Delete Permanently?",
			`Delete ${selectedTasks.length} tasks permanently? This action cannot be undone.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						if (selectedTasks.length > 0) {
							setAllTasks(
								allTasks.filter((t) => !selectedTasks.includes(t.id))
							);
							setSelectedTasks([]);
							setSelectionMode(false);
						}
					},
				},
			]
		);
	};

	const handleRestoreSelected = () => {
		if (selectedTasks.length > 0) {
			setAllTasks(
				allTasks.map((task) =>
					selectedTasks.includes(task.id)
						? { ...task, deletedAt: undefined }
						: task
				)
			);
			setSelectedTasks([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedTasks([]);
	};

	const renderTaskItem = ({ item }: { item: Task }) => (
		<TouchableOpacity
			onPress={() => {
				if (selectionMode) {
					handleSelectTask(item.id);
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
							selectedTasks.includes(item.id)
								? "bg-red-500"
								: "bg-zinc-700 border-2 border-zinc-500"
						}`}
					>
						{selectedTasks.includes(item.id) && (
							<MaterialIcons name="check" size={16} color="white" />
						)}
					</View>
				</View>
			)}
			<View className="flex-1 pr-4">
				<Text
					className={`text-white font-medium text-base mb-1 ${
						item.completed ? "line-through text-zinc-500" : ""
					}`}
					numberOfLines={2}
				>
					{item.title}
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
						onPress={() => restoreTask(item.id)}
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
						{selectedTasks.length} selected
					</Text>
					<View className="flex-row items-center gap-3">
						<TouchableOpacity onPress={handleSelectAll}>
							<MaterialIcons
								name={
									selectedTasks.length === deletedTasks.length
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
				<Text className="text-white text-xl font-bold">Deleted Tasks</Text>
				<View style={{ width: 28 }} />
			</View>

			{/* Task List */}
			<FlatList
				data={deletedTasks}
				renderItem={renderTaskItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={() => (
					<View className="flex-1 justify-center items-center mt-32">
						<MaterialIcons name="delete-outline" size={64} color="#3f3f46" />
						<Text className="text-gray-500 text-lg mt-4">No deleted tasks</Text>
					</View>
				)}
			/>
		</View>
	);
}
