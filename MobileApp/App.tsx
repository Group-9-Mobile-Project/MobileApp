import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";
import { useEffect, useState } from "react";
import { useProfile } from "./hooks/useProfile";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/AuthContext";

export default function App() {

  const [profile, setProfile] = useState(null);
  const { getProfile, deleteProfile } = useProfile();

  const handleLogout = async () => {
    await deleteProfile();
    setProfile(null);
  };

  useEffect(() => {
    (async () => {
      const stored = await getProfile();
      if (stored) setProfile(stored);
    })();
  }, []);

  if (!profile) {
    return (
      <RegisterScreen/>
    )
  } else {
      return (
    <AuthProvider onLogout={handleLogout}>
      <NavigationContainer>
      <Navigator />
      <StatusBar style="auto" />
    </NavigationContainer>
    </AuthProvider>
  );
  }
}
