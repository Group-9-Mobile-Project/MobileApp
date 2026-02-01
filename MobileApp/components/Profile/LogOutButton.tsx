import { Button, Alert, StyleSheet, Pressable, Text } from "react-native";
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

  return (
    <Pressable style={styles.button} onPress={handleLogOut}>
      <Text style={styles.buttonText}>Kirjaudu ulos</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'grey',
    alignItems: 'center',
    padding: 12,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
  }
})