import { useSecurity } from "@/context/SecurityContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
	Alert,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordReset() {
	const router = useRouter();
	const { getSecurityQuestion, resetPassword } = useSecurity();

	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [newPin, setNewPin] = useState("");
	const [confirmPin, setConfirmPin] = useState("");

	const loadQuestion = useCallback(async () => {
		const q = await getSecurityQuestion();
		if (q) {
			setQuestion(q);
		}
	}, [getSecurityQuestion]);

	useEffect(() => {
		loadQuestion();
	}, [loadQuestion]);

	const handleReset = async () => {
		if (!answer) {
			Alert.alert("Error", "Please answer the security question");
			return;
		}

		if (!newPin || newPin.length !== 4) {
			Alert.alert("Error", "PIN must be exactly 4 digits");
			return;
		}

		if (newPin !== confirmPin) {
			Alert.alert("Error", "PINs do not match");
			return;
		}

		const success = await resetPassword(answer, newPin);
		if (success) {
			Alert.alert("Success", "PIN reset successfully", [
				{
					text: "OK",
					onPress: () => router.replace("/(roots)/private-auth"),
				},
			]);
		} else {
			Alert.alert("Error", "Incorrect answer to security question");
			setAnswer("");
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<ScrollView className="flex-1">
				<View className="flex-row items-center p-6">
					<TouchableOpacity onPress={() => router.back()} className="mr-4">
						<MaterialIcons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text className="text-2xl text-red-500 font-bold">Reset PIN</Text>
				</View>

				<View className="px-6 mt-8">
					<View className="items-center mb-8">
						<MaterialIcons name="lock-reset" size={64} color="#ef4444" />
						<Text className="text-white text-xl font-semibold mt-4">
							Forgot Your PIN?
						</Text>
						<Text className="text-zinc-500 text-center mt-2">
							Answer your security question to reset your PIN
						</Text>
					</View>

					<View className="mb-6">
						<Text className="text-zinc-400 text-sm mb-2">
							Security Question
						</Text>
						<View className="bg-zinc-900 p-4 rounded-2xl">
							<Text className="text-white text-base">{question}</Text>
						</View>
					</View>

					<View className="mb-6">
						<Text className="text-zinc-400 text-sm mb-2">Your Answer</Text>
						<TextInput
							className="bg-zinc-900 text-white p-4 rounded-2xl text-base"
							placeholder="Enter your answer"
							placeholderTextColor="#71717a"
							value={answer}
							onChangeText={setAnswer}
							autoCapitalize="none"
						/>
					</View>

					<View className="mb-6">
						<Text className="text-zinc-400 text-sm mb-2">New PIN</Text>
						<TextInput
							className="bg-zinc-900 text-white p-4 rounded-2xl text-base"
							placeholder="Enter new PIN (4 digits)"
							placeholderTextColor="#71717a"
							value={newPin}
							onChangeText={setNewPin}
							secureTextEntry
							keyboardType="numeric"
							maxLength={4}
						/>
					</View>

					<View className="mb-8">
						<Text className="text-zinc-400 text-sm mb-2">Confirm New PIN</Text>
						<TextInput
							className="bg-zinc-900 text-white p-4 rounded-2xl text-base"
							placeholder="Re-enter new PIN"
							placeholderTextColor="#71717a"
							value={confirmPin}
							onChangeText={setConfirmPin}
							secureTextEntry
							keyboardType="numeric"
							maxLength={4}
						/>
					</View>

					<TouchableOpacity
						className="bg-red-500 p-5 rounded-2xl items-center"
						onPress={handleReset}
					>
						<Text className="text-white text-base font-semibold">
							Reset PIN
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
