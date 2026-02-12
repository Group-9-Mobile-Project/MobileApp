import { MD3DarkTheme, MD3Theme } from "react-native-paper";
import { DarkTheme } from "@react-navigation/native";
import { Colors } from "../constants/colors";

const customDarkTheme: MD3Theme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme: MD3Theme = { ...MD3DarkTheme, colors: Colors.light };

// Custom navigation theme using colors.js
const navigationDarkTheme = {
  ...DarkTheme,
  colors: Colors.navigationDark,
};

export {
customDarkTheme,
customLightTheme,
navigationDarkTheme
};
