import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Event } from "../../types/Event";
import { firestore, EVENT } from "../../firebase/Config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth } from "../../firebase/Config";

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
 
  async function handleFirebaseAddEvent(): Promise<void> {
    const ownerEmail = auth.currentUser?.email;
    const organizerName = auth.currentUser?.displayName?.trim() || ownerEmail || "Tuntematon";
    if (!ownerEmail) {
      Alert.alert("Virhe", "Kirjaudu sisään ennen tapahtuman luontia");
      return;
    }
    if (!title || !date || !location || !startTime || !endTime) {
      Alert.alert("Virhe", "Täytä vähintään nimi, päivä, paikka ja ajat");
      return;
    }

    try {
      const eventsRef = collection(firestore, EVENT);
      const eventRef = doc(eventsRef);
      
      const payload = {
        id: eventRef.id,
        title,
        description,
        date,
        location: location as unknown as Event["location"],
        attendees: [],
        organizer: organizerName,
        startTime,
        endTime,
        ownerEmail
      };

      await setDoc(eventRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Onnistui", "Tapahtuma luotu");
      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error("Failed to save new event", err);
      Alert.alert("Virhe", "Tapahtuman tallennus epäonnistui");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luo tapahtuma</Text>

      <TextInput
        style={styles.input}
        placeholder="Tapahtuman nimi"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Päivämäärä (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Paikka"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Alkaa (HH:mm)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Päättyy (HH:mm)"
        value={endTime}
        onChangeText={setEndTime}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Kuvaus (valinnainen)"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Tallenna" onPress={handleFirebaseAddEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
});