import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function TaskScreen() {
	// 1. We wrap the data in useState so we can modify it
	// Added 'completed: false' to every item to track state
	const [tasks, setTasks] = useState([
		{ id: "1", title: "Finish React Native project", completed: false },
		{ id: "2", title: "Review pull requests", completed: false },
		{ id: "3", title: "Update project documentation", completed: false },
		{ id: "4", title: "Team meeting at 3 PM", completed: false },
		{ id: "5", title: "Plan next sprint tasks", completed: false },
		{ id: "6", title: "Fix bugs reported by QA", completed: false },
		{ id: "7", title: "Optimize app performance", completed: false },
		{
			id: "8",
			title: "Prepare presentation for stakeholders",
			completed: false,
		},
	]);

	// Logic to remove a task
	const deleteTask = (id: string) => {
		// Filter creates a new array excluding the item with the given ID
		setTasks(tasks.filter((item) => item.id !== id));
	};

	// Logic to toggle checkbox
	const toggleCheckbox = (id: string) => {
		setTasks(
			tasks.map((item) => {
				// If this is the item we clicked, flip its completed status
				if (item.id === id) {
					return { ...item, completed: !item.completed };
				}
				return item;
			})
		);
	};

	return (
		<View className="flex-1 bg-black p-4">
			<FlatList
				data={tasks}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View className="flex-row bg-zinc-900 p-5 rounded-3xl justify-between items-center mb-3">
						{/* Task Title with Conditional Styling */}
						{/* flex-1 ensures the text takes up available space so icons don't get pushed off */}
						<Text
							className={`text-base font-medium flex-1 mr-4 ${
								item.completed ? "text-zinc-500 line-through" : "text-gray-200"
							}`}
						>
							{item.title}
						</Text>

						<View className="flex-row items-center gap-5">
							{/* Checkbox Button */}
							<TouchableOpacity onPress={() => toggleCheckbox(item.id)}>
								<MaterialIcons
									name={
										item.completed ? "check-box" : "check-box-outline-blank"
									}
									size={22}
									// Change color to green if completed, white if not
									color={"white"}
								/>
							</TouchableOpacity>

							{/* Delete Button */}
							<TouchableOpacity onPress={() => deleteTask(item.id)}>
								<MaterialIcons
									name="delete-outline"
									size={24}
									color="#ef4444"
								/>
							</TouchableOpacity>
						</View>
					</View>
				)}
			/>
		</View>
	);
}
