import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function NoteScreen() {
	const notes = [
		{ id: "1", title: "www.google.com" },
		{
			id: "2",
			title:
				"Shopping List:\n- Apples\n- Bananas\n- Carrots\n- Detergent\n- Eggs\n- Flour\n- Grapes\n- Honey\n- Ice Cream\n- Juice",
		},
		{
			id: "3",
			title:
				"A long note example that will test the max height functionality. this note is intentionally verbose to check how the UI handles overflow and text wrapping within the card component.",
		},
		{
			id: "4",
			title:
				"Meeting Notes\n\n- Discuss project timeline\n- Assign tasks to team members\n- Set deadlines for deliverables\n- Plan next meeting date\n\nDon't forget to follow up on action items!",
		},
		{
			id: "5",
			title:
				"Long Note Example\n\nThis is a very long note that will test the max height functionality. It keeps going and going to ensure that the card stops expanding at a certain point so it doesn't ruin the grid layout.\n\nMore text here...\nAnd more...",
		},
	];

	// Split into two columns for the masonry layout
	const leftColumn = notes.filter((_, i) => i % 2 === 0);
	const rightColumn = notes.filter((_, i) => i % 2 !== 0);

	// Reusable Card Component to allow cleaner code
	const NoteCard = ({ item }: { item: { id: string; title: string } }) => (
		<View
			key={item.id}
			className="bg-zinc-900 p-5 rounded-3xl mb-3 overflow-hidden"
			style={{
				minHeight: 50, // Ensures small notes aren't too tiny
				maxHeight: 210, // LIMITS the height for big notes
			}}
		>
			<Text className="text-gray-200 text-base font-medium whitespace-pre-wrap leading-6">
				{item.title}
			</Text>
		</View>
	);

	return (
		<View className="flex-1 bg-black p-4">
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
						<NoteCard key={item.id} item={item} />
					))}
				</View>

				{/* Right column */}
				<View style={{ width: "48%" }}>
					{rightColumn.map((item) => (
						<NoteCard key={item.id} item={item} />
					))}
				</View>
			</ScrollView>
		</View>
	);
}
