import { NoteProvider } from "@/context/NoteContext";
import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
	return (
		<NoteProvider>
			<Stack>
				<Stack.Screen
					name="(tabs)"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="note-editor"
					options={{
						headerShown: false,
						presentation: "modal",
						animation: "slide_from_bottom",
					}}
				/>
				<Stack.Screen
					name="list-editor"
					options={{
						headerShown: false,
						presentation: "modal",
						animation: "slide_from_bottom",
					}}
				/>
				<Stack.Screen
					name="private"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="security-setup"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="private-auth"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="password-reset"
					options={{
						headerShown: false,
					}}
				/>

				<Stack.Screen
					name="deleted"
					options={{
						title: "Recently Deleted",
						animation: "slide_from_right",
						headerStyle: {
							backgroundColor: "black",
						},
						headerTitleStyle: {
							color: "red",
							fontSize: 20,
							fontWeight: "bold",
						},
						headerTintColor: "red",
					}}
				/>
			</Stack>
		</NoteProvider>
	);
}
