import { useTheme } from "@/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { checkBiometrics } from "./biometrics";
import { hasPinConfigured, savePin, verifyPin } from "./storage";

// Simple types
type AuthMode = "CHECKING" | "CREATE_PIN" | "ENTER_PIN" | "BIOMETRIC";

export default function AuthScreen({ onUnlock }: { onUnlock: () => void }) {
	const [mode, setMode] = useState<AuthMode>("CHECKING");
	const [pin, setPin] = useState("");
	const [message, setMessage] = useState("Loading...");
	const { colors } = useTheme();

	// 1. Initial Setup Check
	useEffect(() => {
		const checkSetup = async () => {
			const hasPin = await hasPinConfigured();
			if (!hasPin) {
				setMode("CREATE_PIN");
				setMessage("Create a 4-digit PIN");
			} else {
				// Try Biometrics first
				const bioSuccess = await checkBiometrics();
				if (bioSuccess) {
					onUnlock(); // Success!
				} else {
					setMode("BIOMETRIC"); // Show Biometric Icon with "Enter PIN" button
				}
			}
		};

		checkSetup();
	}, [onUnlock]);

	// 2. Handle PIN Input
	const handlePress = async (num: string) => {
		if (pin.length >= 4) return;

		const newPin = pin + num;
		setPin(newPin);

		// If 4 digits reached, process it
		if (newPin.length === 4) {
			if (mode === "CREATE_PIN") {
				await savePin(newPin);
				Alert.alert("Success", "PIN Set Successfully!");
				onUnlock();
			} else if (mode === "ENTER_PIN") {
				const isValid = await verifyPin(newPin);
				if (isValid) {
					onUnlock();
				} else {
					Alert.alert("Error", "Wrong PIN");
					setPin(""); // Reset
				}
			}
		}
	};

	const handleDelete = () => setPin(pin.slice(0, -1));

	// --- RENDERING ---

	// 3. Render Biometric Standby Screen
	if (mode === "BIOMETRIC") {
		return (
			<View
				className="flex-1 justify-center items-center"
				style={{ backgroundColor: colors.background }}
			>
				<TouchableOpacity
					onPress={async () => {
						const success = await checkBiometrics();
						if (success) onUnlock();
					}}
					className="justify-center items-center"
				>
					<MaterialIcons name="fingerprint" size={70} color="#707070" />
					<Text className=" mt-3" style={{ color: colors.text2 }}>
						Retry Fingerprint
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						setMode("ENTER_PIN");
						setMessage("Enter your PIN");
					}}
					className="mt-10"
				>
					<Text className="text-lg mt-2" style={{ color: colors.text2 }}>
						Enter PIN
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	// 4. Render PIN Pad (For Create or Enter)
	if (mode === "CREATE_PIN" || mode === "ENTER_PIN") {
		const numbers = [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"",
			"0",
			"del",
		];

		return (
			<View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
				<Text className="text-2xl font-bold mb-8" style={{ color: colors.text }}>
					{message}
				</Text>

				{/* PIN Dots Display */}
				<View className="flex-row mb-10 gap-4">
					{[1, 2, 3, 4].map((i) => (
						<View
							key={i}
							className={`w-4 h-4 rounded-full ${pin.length >= i ? "bg-red-500" : "bg-gray-300"}`}
						/>
					))}
				</View>

				{/* Number Pad Grid */}
				<View className="flex-row flex-wrap w-80 justify-center gap-4">
					{numbers.map((num) => (
						<TouchableOpacity
							key={num}
							onPress={() =>
								num === "del" ? handleDelete() : num !== "" && handlePress(num)
							}
							className="w-24 h-20 justify-center items-center rounded-xl"
							style={{ backgroundColor: colors.card }}
						>
							{num === "del" ? (
								<MaterialIcons name="backspace" size={24} color="gray" />
							) : (
								<Text
									className="text-xl font-bold"
									style={{ color: colors.text }}
								>
									{num}
								</Text>
							)}
						</TouchableOpacity>
					))}
				</View>
			</View>
		);
	}

	return (
		<View className="flex-1" style={{ backgroundColor: colors.background }} />
	); // Loading state
}
