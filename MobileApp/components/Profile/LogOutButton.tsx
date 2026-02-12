import { Button, Alert, Pressable, Text } from "react-native";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import globalStyles from "../../themes/GlobalStyles";

export default function LogOutButton() {
  const { signOutUser } = useAuth();

  const handleLogOut = () => {
    Alert.alert("Kirjaudu ulos", "Haluatko varmasti kirjautua ulos?", [
      { text: "Peruuta", style: "cancel" },
      { text: "Kyllä", style: "destructive", onPress: signOutUser },
    ]);
  };

  return (
    <Pressable style={globalStyles.logOutButton} onPress={handleLogOut}>
      <Text style={globalStyles.logOutButtonText}>Kirjaudu ulos</Text>
    </Pressable>
  );
}