import { ListProvider } from "@/context/ListContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { Stack } from "expo-router";

export default function AppLayout() {
	return (
		<SecurityProvider>
			<ListProvider>
				<Stack>
					<Stack.Screen
						name="index"
						options={{
							headerShown: false,
						}}
					/>

					<Stack.Screen
						name="(roots)"
						options={{
							headerShown: false,
						}}
					/>
				</Stack>
			</ListProvider>
		</SecurityProvider>
	);
}
