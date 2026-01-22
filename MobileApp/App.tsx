import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";
import { useEffect, useState } from "react";
import { useProfile } from "./hooks/useProfile";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/AuthContext";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {

  const [profile, setProfile] = useState(null);
  const { saveProfile, getProfile, deleteProfile } = useProfile();

  useEffect(() => {
    (async () => {
      const stored = await getProfile();
      if (stored) setProfile(stored);
    })();
  }, []);

  const handleLogin = async (profile: any) => {
    await saveProfile(profile);
    setProfile(profile);
  };

  const handleLogout = async () => {
    await deleteProfile();
    setProfile(null);
  };

  if (!profile) {
    return (
      <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
        <SafeAreaProvider style={{marginBottom: initialWindowMetrics?.insets.bottom}}>
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
