import { FloatingButton } from "@/components/FloatingButton";
import { useTasks } from "@/context/TaskContext";
import { useTheme } from "@/context/ThemeContext";
import { Task } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import React, { useEffect, useRef, useState } from "react";
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	SectionList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

// 1. Configure Handler (UI behavior when app is open)
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
		shouldShowBanner: true,
		shouldShowList: true,
	}),
});

interface TaskSection {
	title: string;
	data: Task[];
	count: number;
}

export default function TaskScreen() {
	
	const {
		tasks: allTasks,
		addTask,
		deleteTask,
		deleteMultipleTasks,
		toggleTaskCompletion,
	} = useTasks();
	const [isModalVisible, setModalVisible] = useState(false);
	const [newTaskTitle, setNewTaskTitle] = useState("");
	const [reminderDate, setReminderDate] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectionMode, setSelectionMode] = useState(false);
	const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
	const { colors, isDark } = useTheme();

	// 2. Register the "Mark as Completed" Button Category
	useEffect(() => {
		(async () => {
			// Permission check
			const { status } = await Notifications.requestPermissionsAsync();
			if (status !== "granted") alert("Permissions required for reminders!");

			// Define the category with the button
			await Notifications.setNotificationCategoryAsync("task-reminder", [
				{
					identifier: "MARK_COMPLETED",
					buttonTitle: "Mark as Completed",
					options: {
						opensAppToForeground: true, // App opens so we can update state
					},
				},
			]);
		})();
	}, []);

	// 3. Listener to handle the Button Click
	// We use a ref to access the latest 'allTasks' state inside the listener without stale closures
	// 3. Listener to handle the Button Click
	const tasksRef = useRef(allTasks);
	useEffect(() => {
		tasksRef.current = allTasks;
	}, [allTasks]);

	useEffect(() => {
		const subscription = Notifications.addNotificationResponseReceivedListener(
			async (response) => {
				const actionId = response.actionIdentifier;
				const taskId = response.notification.request.content.data
					.taskId as string;
				const notificationId = response.notification.request.identifier; // <--- 1. Get the Notification ID

				if (actionId === "MARK_COMPLETED" && taskId) {
					// Update the task using context
					const task = tasksRef.current.find((t) => t.id === taskId);
					if (task) {
						toggleTaskCompletion(taskId);
					}

					// 2. Explicitly dismiss this specific notification
					await Notifications.dismissNotificationAsync(notificationId);
				}
			}
		);

		return () => subscription.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const pendingTasks = allTasks.filter((t) => !t.completed);
	const completedTasks = allTasks.filter((t) => t.completed);

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
		if (selectedTasks.length === allTasks.length) {
			setSelectedTasks([]);
		} else {
			setSelectedTasks(allTasks.map((task) => task.id));
		}
	};

	const handleDeleteSelected = () => {
		if (selectedTasks.length > 0) {
			deleteMultipleTasks(selectedTasks);
			setSelectedTasks([]);
			setSelectionMode(false);
		}
	};

	const handleCancelSelection = () => {
		setSelectionMode(false);
		setSelectedTasks([]);
	};

	const sections: TaskSection[] = [
		{
			title: "Pending Tasks",
			data: pendingTasks,

			count: pendingTasks.length,
		},
		{
			title: "Completed Tasks",
			data: completedTasks,

			count: completedTasks.length,
		},
	];

	// 4. Update Schedule Logic to include Category and Task ID
	const scheduleReminder = async (
		title: string,
		date: Date,
		taskId: string
	) => {
		const triggerTime = date.getTime();
		const now = Date.now();
		const secondsFromNow = Math.floor((triggerTime - now) / 1000);

		if (secondsFromNow <= 0) return;

		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Task Reminder",
				body: `Don't forget to: ${title}`,
				categoryIdentifier: "task-reminder", // <--- Attach the button category here
				data: { taskId }, // <--- Send the ID so we know what to complete
			},
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
				seconds: secondsFromNow,
				repeats: false,
			},
		});
	};

	const handleAddTask = async () => {
		if (newTaskTitle.trim().length === 0) return;

		// Create ID first so we can use it for the notification
		const newId = Date.now().toString();

		if (reminderDate) {
			await scheduleReminder(newTaskTitle, reminderDate, newId);
		}

		const newTask: Task = {
			id: newId,
			title: newTaskTitle,
			completed: false,
		};

		addTask(newTask);
		setNewTaskTitle("");
		setReminderDate(null);
		setModalVisible(false);
	};

	const handleDeleteTask = (id: string) => {
		deleteTask(id);
	};

	const toggleCheckbox = (id: string) => {
		toggleTaskCompletion(id);
	};

	const onDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") setShowDatePicker(false);
		if (selectedDate && selectedDate > new Date()) {
			setReminderDate(selectedDate);
		}
	};

	const renderTaskItem = ({ item }: { item: Task }) => {
		const isSelected = selectedTasks.includes(item.id);
		return (
			<TouchableOpacity
				onPress={() => {
					if (selectionMode) {
						handleSelectTask(item.id);
					}
				}}
				onLongPress={() => handleLongPress(item.id)}
				activeOpacity={0.7}
			>
				<View
					className="flex-row p-5 rounded-3xl justify-between items-center mb-3"
					style={{ backgroundColor: colors.card }}
				>
					{selectionMode && (
						<MaterialIcons
							name={isSelected ? "check-circle" : "radio-button-unchecked"}
							size={24}
							color={isSelected ? "#10b981" : "#71717a"}
							style={{ marginRight: 12 }}
						/>
					)}
					<Text
						className={`text-base font-medium flex-1 mr-4 ${item.completed ? (isDark ? "text-zinc-500 line-through" : "text-gray-200 line-through") : ""}`}
						style={{ color: colors.text }}
					>
						{item.title}
					</Text>
					{!selectionMode && (
						<View className="flex-row items-center gap-3">
							<TouchableOpacity onPress={() => toggleCheckbox(item.id)}>
								<MaterialIcons
									name={item.completed ? "replay" : "done"}
									size={22}
									color={colors.text}
								/>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
								<MaterialIcons name="close" size={22} color="#ef4444" />
							</TouchableOpacity>
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	const renderSectionHeader = ({ section }: { section: TaskSection }) => {
		const { title, count, data } = section;
		if (data.length === 0) return null;
		return (
			<View
				className="flex-row gap-2 items-center mb-4 mt-4"
				style={{ backgroundColor: colors.background }}
			>
				<Text className=" text-sm font-medium" style={{ color: colors.text }}>
					{title}
				</Text>
				<View
					className={`bg-red-500 rounded-full w-5 h-5 items-center justify-center`}
				>
					<Text className="text-white text-xs font-semibold">{count}</Text>
				</View>
				<View className="bg-gray-500 w-full h-[1]" />
			</View>
		);
	};

	return (
		<View
			className="flex-1 p-4 relative"
			style={{ backgroundColor: colors.background }}
		>
			{/* Selection Mode Header */}
			{selectionMode && (
				<View
					className="flex-row items-center justify-between mb-4 p-3 rounded-2xl"
					style={{ backgroundColor: colors.card }}
				>
					<TouchableOpacity onPress={handleCancelSelection}>
						<MaterialIcons name="close" size={24} color={colors.text} />
					</TouchableOpacity>
					<Text className=" font-medium" style={{ color: colors.text }}>
						{selectedTasks.length} selected
					</Text>
					<View className="flex-row items-center gap-3">
						<TouchableOpacity onPress={handleSelectAll}>
							<MaterialIcons
								name={
									selectedTasks.length === allTasks.length
										? "deselect"
										: "select-all"
								}
								size={24}
								color={colors.text}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleDeleteSelected}>
							<MaterialIcons name="delete" size={24} color="#ef4444" />
						</TouchableOpacity>
					</View>
				</View>
			)}

			<SectionList
				sections={allTasks.length > 0 ? sections : []}
				keyExtractor={(item) => item.id}
				renderItem={renderTaskItem}
				renderSectionHeader={renderSectionHeader}
				showsVerticalScrollIndicator={false}
				stickySectionHeadersEnabled={false}
				contentContainerStyle={{ flexGrow: 1 }}
				ListEmptyComponent={() => (
					<View className="flex-1 justify-center items-center mb-20 opacity-50">
						<MaterialIcons name="playlist-add" size={48} color={colors.text} />
						<Text className="font-medium mt-4" style={{ color: colors.text }}>
							No tasks found
						</Text>
						<Text className="text-center text-sm mt-2 px-10" style={{ color: colors.text }}>
							Tap + to add a task
						</Text>
					</View>
				)}
			/>

			<Modal
				animationType="fade"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					className="flex-1 justify-center items-center bg-black/80"
				>
					<View className="w-11/12 p-6 rounded-2xl border border-zinc-800" style={{ backgroundColor: colors.background }}>
						<Text className=" text-xl font-bold mb-4" style={{ color: colors.text }}>
							Create New Task
						</Text>

						<TextInput
							className="bg-zinc-800 p-4 rounded-xl text-lg mb-4"
							style={{ backgroundColor: colors.card, color: colors.text }}
							placeholder="What needs to be done?"
							placeholderTextColor="#71717a"
							autoFocus={true}
							value={newTaskTitle}
							onChangeText={setNewTaskTitle}
						/>

						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
							className={`p-3 rounded-xl mb-6 flex-row items-center gap-2 border ${
								reminderDate
									? "bg-red-500/10 border-red-500"
									: "bg-zinc-800 border-transparent"
							}`}
							style={{ backgroundColor: reminderDate ? "rgba(239, 68, 68, 0.1)" : colors.card, borderColor: reminderDate ? "#ef4444" : "transparent" }}
						>
							<MaterialIcons
								name="alarm"
								size={18}
								color={reminderDate ? "#ef4444" : isDark ? "#A1A1AA" : "#71717a"}
							/>
							<Text
								className={
									reminderDate
										? "text-red-400 font-medium"
										: " text-sm"
								}
								style={{ color: reminderDate ? "#ef4444" : colors.text }}
							>
								{reminderDate
									? reminderDate.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})
									: "Set Reminder"}
							</Text>
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								value={reminderDate || new Date()}
								mode="time"
								is24Hour={false}
								display="default"
								onChange={onDateChange}
								// 1. Force the background to be dark
								themeVariant="dark"
								// 2. Change the "Action" color (Buttons, Selected Date) to Red
								accentColor="#ef4444"
								// 3. Force text to be white (Mainly for iOS Spinner mode)
								textColor="white"
							/>
						)}

						<View className="flex-row justify-end gap-4">
							<TouchableOpacity
								onPress={() => {
									setModalVisible(false);
									setReminderDate(null);
								}}
								className="px-4 py-2"
							>
								<Text className="text-zinc-400 font-medium text-lg">
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={handleAddTask}
								className="bg-red-500 px-6 py-2 rounded-xl"
							>
								<Text className="text-white font-semibold text-lg">Save</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
			</Modal>

			<FloatingButton onPress={() => setModalVisible(true)} />
		</View>
	);
}
