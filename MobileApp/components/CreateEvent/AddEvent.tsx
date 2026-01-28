import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Event, EventType, Location } from "../../types/Event";
import { firestore, EVENT } from "../../firebase/Config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { auth } from "../../firebase/Config";

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
      setStartTime("");
      setEndTime("");
      setLocationName("");
      setLocationAddress("");
      setLatitudeInput("");
      setLongitudeInput("");
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
      <Text style={styles.label}>Päivämäärä</Text>
      <Button
        title={formattedDate}
        onPress={() => setShowDatePicker(true)}
      />
      
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={dateValue}
            mode="date"
            display={Platform.OS === "android" ? "calendar" : "inline"}
            locale="fi-FI"
            onChange={handleDateChange}
          />
          <Button title="Valmis" onPress={() => setShowDatePicker(false)} />
        </View>
      )}

      )}
      <TextInput
        style={styles.input}
        placeholder="Sijainnin nimi"
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={styles.input}
        placeholder="Osoite"
        value={locationAddress}
        onChangeText={setLocationAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitudeInput}
        onChangeText={setLatitudeInput}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitudeInput}
        onChangeText={setLongitudeInput}
        keyboardType="numeric"
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

      <Text style={styles.label}>Tyyppi</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={type}
          onValueChange={(value) => setType(value as EventType)}
        >
          <Picker.Item label="Kävely" value="kävely" />
          <Picker.Item label="Juoksu" value="juoksu" />
        </Picker>
      </View>

      <Button title="Tallenna" onPress={handleFirebaseAddEvent} />
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