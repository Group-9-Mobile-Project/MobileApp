import { Button, Alert } from "react-native";
import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function LogOutButton() {
  const { signOutUser } = useAuth();

  const handleLogOut = () => {
    Alert.alert("Kirjaudu ulos", "Haluatko varmasti kirjautua ulos?", [
      { text: "Peruuta", style: "cancel" },
      { text: "Kyllä", style: "destructive", onPress: signOutUser },
    ]);
  };

  return <Button title="Kirjaudu ulos" onPress={handleLogOut} />;
}
