import { useNotes } from "@/context/NoteContext"; // Import context
import { useTheme } from "@/context/ThemeContext";
import { Note } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

export default function RecentlyDeleted() {
	const {
		trash,
		restoreNote,
		restoreMultipleNotes,
		permanentlyDelete,
		permanentlyDeleteMultiple,
	} = useNotes();
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
	const { colors } = useTheme();

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
		setSelectedNotes([id]);
	};

	const handleSelectNote = (id: string) => {
		if (selectedNotes.includes(id)) {
			setSelectedNotes(selectedNotes.filter((noteId) => noteId !== id));
		} else {
			setSelectedNotes([...selectedNotes, id]);
		}
	};

	const handleSelectAll = () => {
		if (selectedNotes.length === trash.length) {
			setSelectedNotes([]);
		} else {
			setSelectedNotes(trash.map((note) => note.id));
		}
	};

	const handleDeleteSelected = () => {
		Alert.alert(
			"Delete Permanently?",
			`Delete ${selectedNotes.length} notes permanently? This action cannot be undone.`,
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => {
						if (selectedNotes.length > 0) {
							permanentlyDeleteMultiple(selectedNotes);
							setSelectedNotes([]);
							setSelectionMode(false);
						}
					},
				},
			]
		);
	};

	const handleRestoreSelected = () => {
		if (selectedNotes.length > 0) {
			restoreMultipleNotes(selectedNotes);
			setSelectedNotes([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedNotes([]);
	};

	const renderTrashItem = ({ item }: { item: Note }) => (
		<TouchableOpacity
			onPress={() => {
				if (selectionMode) {
					handleSelectNote(item.id);
				}
			}}
			onLongPress={() => handleLongPress(item.id)}
			className=" p-4 rounded-2xl mb-3 flex-row justify-between items-center"
			style={{ backgroundColor: colors.card }}
		>
			{/* Checkbox for selection mode */}
			{selectionMode && (
				<View className="mr-3">
					<View
						className={`w-6 h-6 rounded-full items-center justify-center ${
							selectedNotes.includes(item.id)
								? "bg-red-500"
								: "bg-zinc-700 border-2 border-zinc-500"
						}`}
					>
						{selectedNotes.includes(item.id) && (
							<MaterialIcons name="check" size={16} color="white" />
						)}
					</View>
				</View>
			)}
			<View className="flex-1 pr-4">
				<Text
					className="font-bold text-lg mb-1"
					numberOfLines={1}
					style={{ color: colors.text }}
				>
					{item.title}
				</Text>
				<Text
					className="text-zinc-500 text-sm mb-2"
					numberOfLines={1}
					style={{ color: colors.text2 }}
				>
					{item.content}
				</Text>
				<Text className="text-xs" style={{ color: colors.tint }}>
					Auto-deletes in {calculateDaysLeft(item.deletedAt)} days
				</Text>
			</View>

			{/* Action Buttons - Hide in selection mode */}
			{!selectionMode && (
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
			)}
		</TouchableOpacity>
	);

	return (
		<View
			className="flex-1 px-4 py-2"
			style={{ backgroundColor: colors.background }}
		>
			{/* Selection Mode Header */}
			{selectionMode && (
				<View
					className="flex-row items-center justify-between mb-3 p-3 rounded-2xl"
					style={{ backgroundColor: colors.card }}
				>
					<TouchableOpacity onPress={handleCancelSelection}>
						<MaterialIcons name="close" size={24} color={colors.text} />
					</TouchableOpacity>
					<Text className="font-semibold" style={{ color: colors.text }}>
						{selectedNotes.length} selected
					</Text>
					<View className="flex-row gap-3">
						<TouchableOpacity
							onPress={handleSelectAll}
							className="bg-zinc-800 px-3 py-2 rounded-full"
						>
							<Text className="text-white text-sm font-medium">
								{selectedNotes.length === trash.length
									? "Deselect All"
									: "Select All"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleRestoreSelected}
							disabled={selectedNotes.length === 0}
							className={`px-3 py-2 rounded-full ${
								selectedNotes.length === 0 ? "bg-zinc-800" : "bg-green-600"
							}`}
						>
							<MaterialIcons
								name="restore"
								size={20}
								color={selectedNotes.length === 0 ? "#71717a" : "white"}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleDeleteSelected}
							disabled={selectedNotes.length === 0}
							className={`px-3 py-2 rounded-full ${
								selectedNotes.length === 0 ? "bg-zinc-800" : "bg-red-500"
							}`}
						>
							<MaterialIcons
								name="delete-forever"
								size={20}
								color={selectedNotes.length === 0 ? "#71717a" : "white"}
							/>
						</TouchableOpacity>
					</View>
				</View>
			)}

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
					<View className="items-center justify-center pt-40 opacity-50">
						<MaterialIcons
							name="delete-outline"
							size={64}
							color={colors.text}
						/>
						<Text
							className=" text-lg mt-4 font-medium"
							style={{ color: colors.text }}
						>
							Trash is empty
						</Text>
					</View>
				)}
			/>
		</View>
	);
}
