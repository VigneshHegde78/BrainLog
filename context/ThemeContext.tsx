import React, { createContext, ReactNode, useContext, useState } from "react";
import { darkTheme, lightTheme } from "../src/theme";

type ThemeContextType = {
	isDark: boolean;
	colors: typeof lightTheme;
	toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
	isDark: false,
	colors: lightTheme,
	toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [isDark, setIsDark] = useState(false);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	const colors = isDark ? darkTheme : lightTheme;

	return (
		<ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
