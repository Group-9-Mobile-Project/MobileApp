import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { Colors } from "../constants/colors";

const customDarkTheme: MD3Theme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme: MD3Theme = { ...MD3DarkTheme, colors: Colors.light };

export {
customDarkTheme,
customLightTheme
};
