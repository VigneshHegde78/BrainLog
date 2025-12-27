import { useNotes } from "@/context/NoteContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; // <--- Import useLocalSearchParams
import React, { useEffect, useState } from "react";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NoteEditorScreen() {
	const router = useRouter();
	const { addNote, updateNote, notes } = useNotes();

	// Get the ID if it was passed (e.g. /note-editor?id=123)
	const { id } = useLocalSearchParams<{ id: string }>();

	// Check if we are in "Edit Mode"
	const isEditing = !!id;

	// Form State
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [tags, setTags] = useState<string[]>([]);
	const [currentTag, setCurrentTag] = useState("");

	// Effect: Load data if we are editing
	useEffect(() => {
		if (isEditing) {
			const existingNote = notes.find((n) => n.id === id);
			if (existingNote) {
				setTitle(existingNote.title);
				setContent(existingNote.content);
				setTags(existingNote.tags);
			}
		}
	}, [id]);

	const handleTagInput = (text: string) => {
		if (text.endsWith(" ") || text.endsWith(",")) {
			const newTag = text.trim().replace(/,/g, "");
			if (newTag.length > 0 && !tags.includes(newTag)) {
				setTags([...tags, newTag]);
				setCurrentTag("");
			}
		} else {
			setCurrentTag(text);
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((t) => t !== tagToRemove));
	};

	const handleSave = () => {
		if (content.trim().length === 0 && title.trim().length === 0) {
			router.back();
			return;
		}

		if (isEditing) {
			// Update existing note
			updateNote(id, title, content, tags);
		} else {
			// Create new note
			addNote(title, content, tags);
		}

		router.back();
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<View className="flex-row justify-between items-center px-4 py-2 border-b border-zinc-900">
				<TouchableOpacity onPress={() => router.back()} className="p-2">
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={handleSave}
					className="bg-red-500 px-4 py-2 rounded-full"
				>
					<Text className="text-white font-semibold">Save</Text>
				</TouchableOpacity>
			</View>

			<ScrollView className="flex-1 p-4">
				<TextInput
					className="text-3xl font-bold text-white mb-4"
					placeholder="Title"
					placeholderTextColor="#52525b"
					value={title}
					onChangeText={setTitle}
					multiline
				/>

				<View className="flex-row flex-wrap items-center gap-2 mb-6">
					<MaterialIcons name="sell" size={20} color="#71717a" />
					{tags.map((tag) => (
						<TouchableOpacity
							key={tag}
							onPress={() => removeTag(tag)}
							className="bg-zinc-800 flex-row items-center px-3 py-1.5 rounded-full"
						>
							<Text className="text-red-400 mr-1">#</Text>
							<Text className="text-gray-300 font-medium">{tag}</Text>
							<MaterialIcons
								name="close"
								size={14}
								color="#71717a"
								style={{ marginLeft: 4 }}
							/>
						</TouchableOpacity>
					))}
					<TextInput
						className="text-gray-400 text-base min-w-[100px]"
						placeholder={tags.length === 0 ? "Add tags..." : ""}
						placeholderTextColor="#52525b"
						value={currentTag}
						onChangeText={handleTagInput}
						autoCapitalize="none"
					/>
				</View>

				<TextInput
					className="text-lg text-gray-300 leading-relaxed min-h-[300px]"
					placeholder="Start typing your thoughts..."
					placeholderTextColor="#52525b"
					value={content}
					onChangeText={setContent}
					multiline
					textAlignVertical="top"
				/>
			</ScrollView>
		</SafeAreaView>
	);
}
