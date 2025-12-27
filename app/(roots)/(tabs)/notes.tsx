import { FloatingButton } from "@/components/FloatingButton";
import { useNotes } from "@/context/NoteContext"; // <--- 1. Import Context
import { Note } from "@/types";
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
	// 2. Get the moveToTrash function
	const { notes, moveToTrash } = useNotes();

	const [searchQuery, setSearchQuery] = useState("");

	const filteredNotes = notes.filter((note) => {
		const text = searchQuery.toLowerCase();
		return (
			note.title.toLowerCase().includes(text) ||
			note.content.toLowerCase().includes(text) ||
			note.tags.some((tag) => tag.toLowerCase().includes(text))
		);
	});

	const leftColumn = filteredNotes.filter((_, i) => i % 2 === 0);
	const rightColumn = filteredNotes.filter((_, i) => i % 2 !== 0);

	// 3. Updated Note Card with Delete Button
	const NoteCard = ({ item }: { item: Note }) => (
		<TouchableOpacity
			key={item.id}
			onPress={() =>
				router.push({ pathname: "/note-editor", params: { id: item.id } })
			}
			className="bg-zinc-900 p-5 rounded-3xl mb-3 overflow-hidden relative" // Added 'relative'
			style={{ minHeight: 100, maxHeight: 250 }}
		>
			{/* Header: Title + Delete Button */}
			<View className="flex-row justify-between items-start mb-2">
				<Text className="text-white text-lg font-bold flex-1 mr-2">
					{item.title}
				</Text>

				{/* Delete Button */}
				<TouchableOpacity
					onPress={() => moveToTrash(item.id)}
					className="p-1 -mt-1 -mr-1" // Negative margins to increase touch area without breaking layout
				>
					<MaterialIcons name="delete-outline" size={22} color="#71717a" />
				</TouchableOpacity>
			</View>

			<Text
				className="text-gray-400 text-base font-medium whitespace-pre-wrap leading-6 mb-4"
				numberOfLines={6}
			>
				{item.content}
			</Text>

			<View className="flex-row flex-wrap gap-2 mt-auto">
				{item.tags.map((tag) => (
					<View key={tag} className="bg-black/40 px-2 py-1 rounded-md">
						<Text className="text-red-400 text-xs font-medium">#{tag}</Text>
					</View>
				))}
			</View>
		</TouchableOpacity>
	);

	return (
		<View className="flex-1 bg-black py-2 px-4 relative">
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
