import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { Event, EventType, Location } from "../../types/Event";
import { firestore, EVENT } from "../../firebase/Config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../../firebase/Config";
import { LocationFields } from "./LocationFields";
import { DateTimeFields } from "./DateTimeFields";

export default function AddEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [type, setType] = useState<EventType>("kävely");
  const [date, setDate] = useState("");
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [latitudeInput, setLatitudeInput] = useState("");
  const [longitudeInput, setLongitudeInput] = useState("");

  function handleDateChange(event: { type?: string }, selected?: Date) {
    if (event.type === "set" && selected) {
      setShowDatePicker(false);
      setDateValue(selected);
      const iso = selected.toISOString().slice(0, 10);
      setDate(iso);
      return;
    }
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  }

  const formattedDate = date
    ? new Intl.DateTimeFormat("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
    : "Valitse päivämäärä";

  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setDateValue(new Date());
    setStartTime("");
    setEndTime("");
    setLocationName("");
    setLocationAddress("");
    setLatitudeInput("");
    setLongitudeInput("");
    setShowDatePicker(false);
    setType("kävely");
  }

  async function handleFirebaseAddEvent(): Promise<void> {
    const ownerEmail = auth.currentUser?.email;
    const organizerName = auth.currentUser?.displayName?.trim() || ownerEmail || "Tuntematon";

    if (!ownerEmail) {
      Alert.alert("Virhe", "Kirjaudu sisään ennen tapahtuman luontia");
      return;
    }
    if (!title || !date || !startTime || !endTime) {
      Alert.alert("Virhe", "Täytä vähintään nimi, päivä, paikka ja ajat");
      return;
    }

    const latitude = parseFloat(latitudeInput);
    const longitude = parseFloat(longitudeInput);

    if (
      !locationName ||
      !locationAddress ||
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      Alert.alert("Virhe", "Täytä sijainti ja kelvolliset koordinaatit");
      return;
    }

    try {
      const eventsRef = collection(firestore, EVENT);
      const eventRef = doc(eventsRef);

      const location: Location = {
        name: locationName,
        address: locationAddress,
        coordinates: {
          latitude,
          longitude,
        },
      };

      const payload: Event = {
        id: eventRef.id,
        title,
        description,
        date,
        type,
        location,
        attendees: [],
        organizer: organizerName,
        startTime,
        endTime,
        ownerEmail,
      };

      await setDoc(eventRef, {
        ...payload,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Onnistui", "Tapahtuma luotu");
      resetForm();
    } catch (err) {
      console.error("Failed to save new event", err);
      Alert.alert("Virhe", "Tapahtuman tallennus epäonnistui");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perustiedot</Text>

      <TextInput
        style={styles.input}
        placeholder="Tapahtuman nimi"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.multiline]}
        placeholder="Kuvaus (valinnainen)"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.title}>Aika</Text>
      <DateTimeFields
        labelStyle={styles.label}
        inputStyle={styles.input}
        datePickerContainerStyle={styles.datePickerContainer}
        formattedDate={formattedDate}
        showDatePicker={showDatePicker}
        setShowDatePicker={setShowDatePicker}
        dateValue={dateValue}
        handleDateChange={handleDateChange}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
      />
      <Text style={styles.title}>Sijainti</Text>
      <LocationFields
        inputStyle={styles.input}
        locationName={locationName}
        setLocationName={setLocationName}
        locationAddress={locationAddress}
        setLocationAddress={setLocationAddress}
        latitudeInput={latitudeInput}
        setLatitudeInput={setLatitudeInput}
        longitudeInput={longitudeInput}
        setLongitudeInput={setLongitudeInput}
      />

      <Text style={styles.title}>Tyyppi</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          onValueChange={(value) => setType(value as EventType)}
        >
          <Picker.Item label="Kävely" value="kävely" />
          <Picker.Item label="Juoksu" value="juoksu" />
        </Picker>
      </View>

      <Button title="Uusi tapahtuma" onPress={handleFirebaseAddEvent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    width: "90%",
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
  label: {
    fontWeight: "600",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  datePickerContainer: {
    gap: 8,
  },
});