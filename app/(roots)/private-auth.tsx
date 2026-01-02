import { useSecurity } from "@/context/SecurityContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivateAuth() {
	const router = useRouter();
	const { authenticate, isSetup } = useSecurity();

	useEffect(() => {
		// If security not set up, redirect to setup
		if (!isSetup) {
			router.replace("/(roots)/security-setup");
		}
	}, [isSetup, router]);

	const [pin, setPin] = useState("");

	const handleKeyPress = (digit: string) => {
		if (pin.length < 6) {
			const newPin = pin + digit;
			setPin(newPin);
			if (newPin.length === 4) {
				// Auto-submit when 4 digits entered
				setTimeout(() => {
					authenticateWithPin(newPin);
				}, 100);
			}
		}
	};

	const authenticateWithPin = async (pinValue: string) => {
		const success = await authenticate(pinValue);
		if (success) {
			router.replace("/(roots)/private");
		} else {
			Alert.alert("Error", "Incorrect PIN");
			setPin("");
		}
	};

	const handleBackspace = () => {
		setPin(pin.slice(0, -1));
	};

	return (
		<SafeAreaView className="flex-1 bg-black">
			<View className="flex-row items-center p-6">
				<TouchableOpacity onPress={() => router.back()} className="mr-4">
					<MaterialIcons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Text className="text-2xl text-red-500 font-bold">Private Notes</Text>
			</View>

			<View className="flex-1 justify-center items-center px-6">
				<MaterialIcons name="lock" size={64} color="#ef4444" />
				<Text className="text-white text-2xl font-bold mt-6 mb-2">
					Enter PIN
				</Text>
				<Text className="text-zinc-500 text-base mb-8">
					Enter your PIN to access private notes
				</Text>

				{/* PIN Display */}
				<View className="flex-row gap-4 mb-12">
					{[0, 1, 2, 3].map((index) => (
						<View
							key={index}
							className={`w-16 h-16 rounded-2xl items-center justify-center ${
								pin.length > index ? "bg-red-500" : "bg-zinc-800"
							}`}
						>
							<Text className="text-white text-3xl">
								{pin.length > index ? "●" : ""}
							</Text>
						</View>
					))}
				</View>

				{/* Number Pad */}
				<View className="w-full max-w-xs">
					<View className="flex-row justify-between mb-4">
						{[1, 2, 3].map((num) => (
							<TouchableOpacity
								key={num}
								onPress={() => handleKeyPress(num.toString())}
								className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center"
							>
								<Text className="text-white text-2xl font-semibold">{num}</Text>
							</TouchableOpacity>
						))}
					</View>
					<View className="flex-row justify-between mb-4">
						{[4, 5, 6].map((num) => (
							<TouchableOpacity
								key={num}
								onPress={() => handleKeyPress(num.toString())}
								className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center"
							>
								<Text className="text-white text-2xl font-semibold">{num}</Text>
							</TouchableOpacity>
						))}
					</View>
					<View className="flex-row justify-between mb-4">
						{[7, 8, 9].map((num) => (
							<TouchableOpacity
								key={num}
								onPress={() => handleKeyPress(num.toString())}
								className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center"
							>
								<Text className="text-white text-2xl font-semibold">{num}</Text>
							</TouchableOpacity>
						))}
					</View>
					<View className="flex-row justify-between">
						<TouchableOpacity
							onPress={() => router.push("/(roots)/password-reset")}
							className="w-20 h-20 rounded-full items-center justify-center"
						>
							<Text className="text-red-400 text-sm">Forgot?</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => handleKeyPress("0")}
							className="w-20 h-20 bg-zinc-800 rounded-full items-center justify-center"
						>
							<Text className="text-white text-2xl font-semibold">0</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleBackspace}
							className="w-20 h-20 rounded-full items-center justify-center"
						>
							<MaterialIcons name="backspace" size={28} color="#71717a" />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}
