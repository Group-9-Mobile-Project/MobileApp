import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { customDarkTheme, navigationDarkTheme } from './themes/MyThemes';
import { RecordingProvider } from "./context/RecordingContext";
import RecordingBubble from "./components/Workout/RecordingBubble";
import { NotificationsProvider } from "./hooks/useNotifications";

function AppContent() {
  const { user, loading } = useAuth();

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

  return (
    <AuthProvider>
      <PaperProvider theme={customDarkTheme}>
        <SafeAreaProvider>
          <RecordingProvider>
            <NotificationsProvider>
              <AppContent /> 
            </NotificationsProvider>
          </RecordingProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}
