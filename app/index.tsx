import { useTheme } from "@/context/ThemeContext";
import { Redirect } from "expo-router";
import { StatusBar } from "react-native";
import "./global.css";

export default function Index() {
	const { isDark } = useTheme();
	return (
		<>
			<StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
			<Redirect href="/notes" />
		</>
	);
}
