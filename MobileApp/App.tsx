import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./components/Navigator";
import { useEffect, useState } from "react";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from "./context/AuthContext";
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase/Config";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAndroid15 = Platform.OS == 'android' && Platform.Version >= 35;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    // Ei tarvitse tehdä mitään — onAuthStateChanged hoitaa
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return null; // Tai latausnäkymä
  }

  if (!user) {
    return (
      <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
        <SafeAreaProvider style={isAndroid15 ? { marginBottom: initialWindowMetrics?.insets.bottom } : {}}>
          <RegisterScreen />
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider onLogin={handleLogin} onLogout={handleLogout}>
      <SafeAreaProvider style={{ marginBottom: initialWindowMetrics?.insets.bottom }}>
        <NavigationContainer>
          <Navigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

