import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <NavigationContainer>
      <BottomNav />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
