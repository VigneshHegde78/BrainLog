import { useSecurity } from "@/context/SecurityContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SecuritySetup() {
	const router = useRouter();
	const { setupSecurity } = useSecurity();

	const [pin, setPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");

	const handleSetup = async () => {
		if (!pin || pin.length !== 4) {
			Alert.alert("Error", "PIN must be exactly 4 digits");
			return;
		}

		if (pin !== confirmPin) {
			Alert.alert("Error", "PINs do not match");
			return;
		}

		if (!question.trim() || !answer.trim()) {
			Alert.alert("Error", "Please provide security question and answer");
			return;
		}

		try {
			await setupSecurity(pin, question, answer);
			router.replace("/(roots)/private");
		} catch {
			Alert.alert("Error", "Failed to setup security");
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-black px-6">
			<View className="flex-row items-center mb-8 mt-4">
				<TouchableOpacity onPress={() => router.back()} className="mr-4">
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text className="text-3xl text-red-500 font-bold">
					Setup Private Security
				</Text>
			</View>

			<View className="flex-1 justify-center">
				<Text className="text-white text-lg mb-2">Create PIN</Text>
				<TextInput
					className="bg-zinc-900 text-white text-lg p-4 rounded-xl mb-4"
					placeholder="Enter 4-digit PIN"
					placeholderTextColor="#71717a"
					value={pin}
					onChangeText={setPin}
					keyboardType="number-pad"
					maxLength={4}
					secureTextEntry
				/>

				<Text className="text-white text-lg mb-2">Confirm PIN</Text>
				<TextInput
					className="bg-zinc-900 text-white text-lg p-4 rounded-xl mb-6"
					placeholder="Re-enter PIN"
					placeholderTextColor="#71717a"
					value={confirmPin}
					onChangeText={setConfirmPin}
					keyboardType="number-pad"
					maxLength={4}
					secureTextEntry
				/>

				<View className="h-0.5 bg-zinc-800 my-4" />

				<Text className="text-white text-lg mb-2">Security Question</Text>
				<TextInput
					className="bg-zinc-900 text-white text-lg p-4 rounded-xl mb-4"
					placeholder="e.g., What's your favorite color?"
					placeholderTextColor="#71717a"
					value={question}
					onChangeText={setQuestion}
					multiline
				/>

				<Text className="text-white text-lg mb-2">Answer</Text>
				<TextInput
					className="bg-zinc-900 text-white text-lg p-4 rounded-xl mb-6"
					placeholder="Your answer"
					placeholderTextColor="#71717a"
					value={answer}
					onChangeText={setAnswer}
				/>

				<TouchableOpacity
					onPress={handleSetup}
					className="bg-red-500 p-4 rounded-xl items-center mt-4"
				>
					<Text className="text-white text-lg font-semibold">
						Setup Security
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
