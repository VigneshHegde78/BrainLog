import { FloatingButton } from "@/components/FloatingButton";
import { useNotes } from "@/context/NoteContext";
import { Note, getVisibleTags } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

export default function NoteScreen() {
	const router = useRouter();
	const { notes, moveToTrash, moveMultipleToTrash } = useNotes();

	const [searchQuery, setSearchQuery] = useState("");
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

	// Filter to show only non-private notes
	const publicNotes = notes.filter((note) => note.isPrivate !== true);

	const filteredNotes = publicNotes.filter((note) => {
		const text = searchQuery.toLowerCase();
		return (
			note.title.toLowerCase().includes(text) ||
			note.content.toLowerCase().includes(text) ||
			note.tags.some((tag) => tag.toLowerCase().includes(text))
		);
	});

	const leftColumn = filteredNotes.filter((_, i) => i % 2 === 0);
	const rightColumn = filteredNotes.filter((_, i) => i % 2 !== 0);

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
		if (selectedNotes.length === filteredNotes.length) {
			setSelectedNotes([]);
		} else {
			setSelectedNotes(filteredNotes.map((note) => note.id));
		}
	};

	const handleDeleteSelected = () => {
		if (selectedNotes.length > 0) {
			moveMultipleToTrash(selectedNotes);
			setSelectedNotes([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedNotes([]);
	};

	// Note Card
	const NoteCard = ({ item }: { item: Note }) => (
		<TouchableOpacity
			key={item.id}
			onPress={() => {
				if (selectionMode) {
					handleSelectNote(item.id);
				} else {
					router.push({ pathname: "/note-editor", params: { id: item.id } });
				}
			}}
			onLongPress={() => handleLongPress(item.id)}
			className="bg-zinc-900 p-5 rounded-3xl mb-3 overflow-hidden relative"
			style={{ minHeight: 100, maxHeight: 250 }}
		>
			{/* Checkbox for selection mode */}
			{selectionMode && (
				<View className="absolute top-3 right-3 z-10">
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
			{/* Header: Title + Delete Button */}
			<View className="flex-row justify-between items-start mb-2">
				<Text className="text-white text-lg font-bold flex-1 mr-2">
					{item.title}
				</Text>

				{/* Delete Button - Hide in selection mode */}
				{!selectionMode && (
					<TouchableOpacity
						onPress={() => moveToTrash(item.id)}
						className="p-1 -mt-1 -mr-1"
					>
						<MaterialIcons name="delete-outline" size={22} color="#71717a" />
					</TouchableOpacity>
				)}
			</View>

			<Text
				className="text-gray-400 text-base font-medium whitespace-pre-wrap leading-6 mb-4"
				numberOfLines={6}
			>
				{item.content}
			</Text>

			<View className="flex-row flex-wrap gap-2 mt-auto">
				{getVisibleTags(item.tags).map((tag) => (
					<View key={tag} className="bg-black/40 px-2 py-1 rounded-md">
						<Text className="text-red-400 text-xs font-medium">{tag}</Text>
					</View>
				))}
			</View>
		</TouchableOpacity>
	);

	return (
		<View className="flex-1 bg-black py-2 px-4 relative">
			{/* Selection Mode Header */}
			{selectionMode && (
				<View className="flex-row items-center justify-between mb-3 bg-zinc-900 p-3 rounded-2xl">
					<TouchableOpacity onPress={handleCancelSelection}>
						<MaterialIcons name="close" size={24} color="white" />
					</TouchableOpacity>
					<Text className="text-white font-semibold">
						{selectedNotes.length} selected
					</Text>
					<View className="flex-row gap-3">
						<TouchableOpacity
							onPress={handleSelectAll}
							className="bg-zinc-800 px-3 py-2 rounded-full"
						>
							<Text className="text-white text-sm font-medium">
								{selectedNotes.length === filteredNotes.length
									? "Deselect All"
									: "Select All"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleDeleteSelected}
							disabled={selectedNotes.length === 0}
							className={`px-3 py-2 rounded-full ${
								selectedNotes.length === 0 ? "bg-zinc-800" : "bg-red-500"
							}`}
						>
							<MaterialIcons
								name="delete"
								size={20}
								color={selectedNotes.length === 0 ? "#71717a" : "white"}
							/>
						</TouchableOpacity>
					</View>
				</View>
			)}

			{/* Search Bar */}
			<View className="mb-4 bg-zinc-900 rounded-2xl flex-row items-center px-4 py-1 border border-zinc-800">
				<MaterialIcons name="search" size={24} color="#71717a" />
				<TextInput
					className="flex-1 text-white text-base ml-3 font-medium"
					placeholder="Search notes or #tags..."
					placeholderTextColor="#71717a"
					value={searchQuery}
					onChangeText={setSearchQuery}
					autoCapitalize="none"
				/>
				{searchQuery.length > 0 && (
					<TouchableOpacity onPress={() => setSearchQuery("")}>
						<MaterialIcons name="close" size={20} color="#71717a" />
					</TouchableOpacity>
				)}
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 100 }}
			>
				{filteredNotes.length === 0 ? (
					<View className="mt-20 items-center opacity-50">
						<MaterialIcons name="sticky-note-2" size={48} color="white" />
						<Text className="text-white mt-4 font-medium">No notes found</Text>
					</View>
				) : (
					<View className="flex-row justify-between">
						<View style={{ width: "48%" }}>
							{leftColumn.map((item) => (
								<NoteCard key={item.id} item={item} />
							))}
						</View>
						<View style={{ width: "48%" }}>
							{rightColumn.map((item) => (
								<NoteCard key={item.id} item={item} />
							))}
						</View>
					</View>
				)}
			</ScrollView>

			<FloatingButton onPress={() => router.push("/note-editor")} />
		</View>
	);
}
