import * as SecureStore from "expo-secure-store";

const PIN_KEY = "user_pin";

// Check if a PIN is already set up
export const hasPinConfigured = async () => {
	const pin = await SecureStore.getItemAsync(PIN_KEY);
	return !!pin; // Returns true if pin exists, false if not
};

// Save a new PIN (for setup)
export const savePin = async (pin: string) => {
	await SecureStore.setItemAsync(PIN_KEY, pin);
};

// Verify if the entered PIN matches the saved one
export const verifyPin = async (inputPin: string) => {
	const storedPin = await SecureStore.getItemAsync(PIN_KEY);
	return inputPin === storedPin;
};
