import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function ListScreen() {
	const lists = [
		{
			id: "1",
			title: "Grocery List",
			listItems: ["Apples", "Bananas", "Carrots", "Detergent", "Eggs"],
		},
		{
			id: "2",
			title: "Project Tasks",
			listItems: ["Design UI mockups", "Set up database"],
		},
		{
			id: "3",
			title: "Books to Read",
			listItems: [
				"The Great Gatsby",
				"1984",
				"To Kill a Mockingbird",
				"The Catcher in the Rye",
			],
		},
		{
			id: "4",
			title: "Travel Packing List",
			listItems: ["Passport", "Tickets", "Clothes", "Toiletries", "Camera"],
		},
		{
			id: "5",
			title: "Workout Routine",
			listItems: [
				"Monday: Chest and Triceps",
				"Wednesday: Back and Biceps",
				"Friday: Legs and Shoulders",
			],
		},
		{
			id: "6",
			title: "Birthday Gift Ideas",
			listItems: ["Watch", "Sunglasses", "Book", "Gift Card"],
		},
	];

	// Split into two columns for the masonry layout
	const leftColumn = lists.filter((_, i) => i % 2 === 0);
	const rightColumn = lists.filter((_, i) => i % 2 !== 0);

	// Reusable Card Component to allow cleaner code
	const ListCard = ({
		item,
	}: {
		item: {
			listItems: any;
			id: string;
			title: string;
		};
	}) => (
		<View
			key={item.id}
			className="bg-zinc-900 p-5 rounded-3xl mb-3 overflow-hidden"
			style={{
				minHeight: 50, // Ensures small lists aren't too tiny
				maxHeight: 210, // LIMITS the height for big lists
			}}
		>
			<Text className="text-gray-200 text-base font-medium whitespace-pre-wrap leading-6">
				{item.title}
			</Text>

			<View className="mt-3">
				{item.listItems &&
					item.listItems.map((listItem: string, index: number) => (
						<Text key={index} className="text-gray-400 text-sm leading-5 mt-1">
							<MaterialIcons name="check-box-outline-blank" size={12} />{" "}
							{listItem}
						</Text>
					))}
			</View>
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
		</View>
	);
}
