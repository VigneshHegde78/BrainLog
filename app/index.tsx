import { Redirect } from "expo-router";
import { StatusBar } from "react-native";
import "./global.css";

export default function Index() {
	return (
		<>
			<StatusBar barStyle="dark-content" />
			<Redirect href="/notes" />
		</>
	);
}
