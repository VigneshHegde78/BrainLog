import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";

interface FloatingButtonProps {
	onPress: () => void;
}

export const FloatingButton = ({ onPress }: FloatingButtonProps) => {
	return (
		<TouchableOpacity
			onPress={onPress}
			// Exact same styling you had in Layout
			className="bg-red-500 w-16 h-16 rounded-full items-center justify-center shadow-lg shadow-red-900 absolute bottom-8 right-8 z-50"
		>
			<MaterialIcons name="add" size={32} color="white" />
		</TouchableOpacity>
	);
};
