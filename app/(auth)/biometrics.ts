import * as LocalAuthentication from "expo-local-authentication";

export const checkBiometrics = async () => {
	// 1. Check if hardware supports it
	const hasHardware = await LocalAuthentication.hasHardwareAsync();
	const isEnrolled = await LocalAuthentication.isEnrolledAsync();

	// If no hardware or no ID saved, we can't use biometrics
	if (!hasHardware || !isEnrolled) return false;

	// 2. Attempt Authentication
	const result = await LocalAuthentication.authenticateAsync({
		promptMessage: "Unlock BrainLog",
		fallbackLabel: "Use PIN",
		disableDeviceFallback: true, // We want to force OUR Pin screen, not the system one
	});

	return result.success;
};
