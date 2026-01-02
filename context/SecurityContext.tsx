import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SecurityContextType {
	isSetup: boolean;
	isAuthenticated: boolean;
	setupSecurity: (
		pin: string,
		question: string,
		answer: string
	) => Promise<void>;
	authenticate: (pin: string) => Promise<boolean>;
	resetPassword: (answer: string, newPin: string) => Promise<boolean>;
	getSecurityQuestion: () => Promise<string | null>;
	logout: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
	undefined
);

export const SecurityProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isSetup, setIsSetup] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		checkSetup();
	}, []);

	const checkSetup = async () => {
		try {
			const pin = await AsyncStorage.getItem("@security_pin");
			setIsSetup(!!pin);
		} catch (error) {
			console.error("Error checking setup:", error);
		}
	};

	const setupSecurity = async (
		pin: string,
		question: string,
		answer: string
	) => {
		try {
			await AsyncStorage.setItem("@security_pin", pin);
			await AsyncStorage.setItem("@security_question", question);
			await AsyncStorage.setItem(
				"@security_answer",
				answer.toLowerCase().trim()
			);
			setIsSetup(true);
			setIsAuthenticated(true);
		} catch (error) {
			console.error("Error setting up security:", error);
			throw error;
		}
	};

	const authenticate = async (pin: string): Promise<boolean> => {
		try {
			const storedPin = await AsyncStorage.getItem("@security_pin");
			if (storedPin === pin) {
				setIsAuthenticated(true);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error authenticating:", error);
			return false;
		}
	};

	const resetPassword = async (
		answer: string,
		newPin: string
	): Promise<boolean> => {
		try {
			const storedAnswer = await AsyncStorage.getItem("@security_answer");
			if (storedAnswer === answer.toLowerCase().trim()) {
				await AsyncStorage.setItem("@security_pin", newPin);
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error resetting password:", error);
			return false;
		}
	};

	const getSecurityQuestion = async (): Promise<string | null> => {
		try {
			return await AsyncStorage.getItem("@security_question");
		} catch (error) {
			console.error("Error getting security question:", error);
			return null;
		}
	};

	const logout = () => {
		setIsAuthenticated(false);
	};

	return (
		<SecurityContext.Provider
			value={{
				isSetup,
				isAuthenticated,
				setupSecurity,
				authenticate,
				resetPassword,
				getSecurityQuestion,
				logout,
			}}
		>
			{children}
		</SecurityContext.Provider>
	);
};

export const useSecurity = () => {
	const context = useContext(SecurityContext);
	if (!context)
		throw new Error("useSecurity must be used within a SecurityProvider");
	return context;
};
