import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";
import { useEffect, useState } from "react";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/AuthContext";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebase/Config";

export default function App() {
  const [profile, setProfile] = useState<User | null>(null);
  const isAndroid15 = Platform.OS == 'android' && Platform.Version >= 35;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setProfile(user);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (profile: any) => {
    setProfile(profile);
  };

  const handleLogout = async () => {
    setProfile(null);
  };

  if (!profile) {
    return (
      <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
        <SafeAreaProvider style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}>
          <RegisterScreen />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AuthProvider>
    )
  } else {
    return (
      <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
        <SafeAreaProvider style={{marginBottom: initialWindowMetrics?.insets.bottom}}>
          <NavigationContainer>
            <Navigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      </AuthProvider>

    );
  }
}
