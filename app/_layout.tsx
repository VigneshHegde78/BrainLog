import { ListProvider } from "@/context/ListContext";
import { SecurityProvider } from "@/context/SecurityContext";
import { TaskProvider } from "@/context/TaskContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";

export default function AppLayout() {
	return (
		<ThemeProvider>
			<SecurityProvider>
				<ListProvider>
					<TaskProvider>
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
					</TaskProvider>
				</ListProvider>
			</SecurityProvider>
		</ThemeProvider>
	);
}
