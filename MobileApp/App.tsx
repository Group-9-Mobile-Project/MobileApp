import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";

export default function App() {
  return (
    <NavigationContainer>
      <Navigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
