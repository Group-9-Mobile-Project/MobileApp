import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation, NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";
import { useEffect, useState } from "react";
import { useProfile } from "./hooks/useProfile";
import RegisterScreen from "./screens/RegisterScreen";

export default function App() {

  const [profile, setProfile] = useState(null);
  const { getProfile, saveProfile } = useProfile();

  useEffect(() => {
    (async () => {
      const stored = await getProfile();
      if (stored) setProfile(stored);
    })();
  }, [getProfile]);

  if (!profile) {
    return (
      <RegisterScreen/>
    )
  } else {
      return (
    <NavigationContainer>
      <Navigator />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
  }
}
