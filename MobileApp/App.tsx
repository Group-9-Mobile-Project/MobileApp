import { StatusBar } from "expo-status-bar";
import { Platform, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootNavigator from "./navigation/RootNavigator";
import { useEffect, useState } from "react";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/AuthContext";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/Config";
import { Provider as PaperProvider } from "react-native-paper";
import { customLightTheme, customDarkTheme, navigationDarkTheme } from './themes/MyThemes';
import { RecordingProvider } from "./context/RecordingContext";
import RecordingBubble from "./components/Workout/RecordingBubble";
import { NotificationsProvider } from "./hooks/useNotifications";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAndroid15 = Platform.OS == "android" && Platform.Version >= 35;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <PaperProvider theme={customDarkTheme}>
        <SafeAreaProvider style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaProvider>
      </PaperProvider>
    );
  }

  if (!user) {
    return (
      <AuthProvider user={user} loading={loading}>
        <PaperProvider theme={customDarkTheme}>
          <SafeAreaProvider style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}>
            <RegisterScreen />
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </PaperProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider user={user} loading={loading}>
      <PaperProvider theme={customDarkTheme}>
        <SafeAreaProvider style={isAndroid15 ? { paddingBottom: initialWindowMetrics?.insets.bottom, backgroundColor: 'black' } : {}}>
          <RecordingProvider>
            <NotificationsProvider>
              <NavigationContainer theme={navigationDarkTheme}>
                <RootNavigator />
                <RecordingBubble />
                <StatusBar style="light" />
              </NavigationContainer>
            </NotificationsProvider>
          </RecordingProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </AuthProvider>
  );
}