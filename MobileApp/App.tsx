import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import BottomNav from "./components/BottomNav";

export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <BottomNav />
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
