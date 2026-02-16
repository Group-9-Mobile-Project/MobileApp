import { StatusBar } from "expo-status-bar";
import { Platform, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { customDarkTheme, navigationDarkTheme } from './themes/MyThemes';
import { RecordingProvider } from "./context/RecordingContext";
import RecordingBubble from "./components/Workout/RecordingBubble";

function AppContent() { 
  const { user, loading } = useAuth();

  const isAndroid15 = Platform.OS == "android" && Platform.Version >= 35;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return <RegisterScreen />;
  }

  return (
    <NavigationContainer theme={navigationDarkTheme}>
      <RootNavigator />
      <RecordingBubble />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

export default function App() {
  const isAndroid15 = Platform.OS == "android" && Platform.Version >= 35;
 
  return (
    <AuthProvider> 
      <PaperProvider theme={customDarkTheme}>
        <SafeAreaProvider style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}>
          <RecordingProvider>
            <AppContent />
          </RecordingProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
