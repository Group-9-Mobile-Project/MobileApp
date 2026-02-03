import { View, Text, TextInput, StyleSheet, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Event, EventType, Location } from "../../types/Event";
import { LocationFields } from "./LocationFields";
import StartLocationPicker from "./StartLocationPicker";
import { Region } from "react-native-maps";
import DateTimePickerField from "../Common/DateTimePickerField";
import { Card, Button as PaperButton, Dialog, Portal, RadioButton } from "react-native-paper";
import { createEvent } from "../../services/eventService";
import { useEventForm } from "../../hooks/useEventForm";
import { useEventLocation } from "../../hooks/useEventLocation";

const DEFAULT_COORDINATE = { latitude: 65.08, longitude: 25.48 };

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function EventForm() {
  const { user } = useAuth();

  const [typeDialogVisible, setTypeDialogVisible] = useState(false);
  
  const openTypeDialog = () => setTypeDialogVisible(true);
  const closeTypeDialog = () => setTypeDialogVisible(false);

  const {
    title,
    setTitle,
    description,
    setDescription,
    date,
    dateValue,
    formattedDate,
    handleDateSelected,
    startTime,
    startTimeValue,
    handleStartTimeSelected,
    type,
    setType,
    locationName,
    setLocationName,
    locationAddress,
    setLocationAddress,
    setLatitudeInput,
    setLongitudeInput,
    resetForm,
    validateForm,
  } = useEventForm({ defaultCoordinate: DEFAULT_COORDINATE });

  const {
    location,
    setLocation,
    selectedCoordinate,
    locationError,
    handleSelectCoordinate,
    refreshCurrentLocation,
    resetLocation,
  } = useEventLocation({
    defaultCoordinate: DEFAULT_COORDINATE,
    defaultRegion: DEFAULT_REGION,
    setLocationName,
    setLocationAddress,
    setLatitudeInput,
    setLongitudeInput,
  });
  
  function resetAll() {
    resetForm();
    resetLocation();
    refreshCurrentLocation();
  }

  async function handleFirebaseAddEvent(): Promise<void> {
    const ownerEmail = user?.email;
    const organizerName = user?.displayName?.trim() || ownerEmail || "Tuntematon";
  
    if (!ownerEmail) {
      Alert.alert("Virhe", "Kirjaudu sisään ennen tapahtuman luontia");
      return;
    }

    const validation = validateForm();
    if (!validation.ok) {
      Alert.alert("Virhe", validation.message);
      return;
    }

    const { latitude, longitude } = validation;
  
    try {
      const location: Location = {
        name: locationName,
        address: locationAddress,
        coordinates: {
          latitude,
          longitude,
        },
      };
  
      const payload: Omit<Event, "id"> = {
        title,
        description,
        date,
        type,
        location,
        attendees: [],
        organizer: organizerName,
        startTime,
        ownerEmail,
      };
  
      await createEvent(payload);
  
      Alert.alert("Onnistui", "Tapahtuma luotu");
      resetAll();
    } catch (err) {
      console.error("Failed to save new event", err);
      Alert.alert("Virhe", "Tapahtuman tallennus epäonnistui");
    }
  }

  return (
     <View style={styles.container}>
       <Card style={styles.card}>
         <Card.Content style={styles.cardContent}>
           <Text style={styles.cardTitle}>Perustiedot</Text>
 
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
 
           <Text style={styles.label}>Tyyppi</Text>
           <PaperButton mode="outlined" onPress={openTypeDialog}>
             {type}
           </PaperButton>
           
           <Portal>
             <Dialog visible={typeDialogVisible} onDismiss={closeTypeDialog}>
               <Dialog.Title>Valitse tyyppi</Dialog.Title>
               <Dialog.Content>
                 <RadioButton.Group
                   value={type}
                   onValueChange={(value) => {
                     setType(value as EventType);
                     closeTypeDialog();
                   }}
                 >
                   <RadioButton.Item label="Kävely" value="Kävely" />
                   <RadioButton.Item label="Juoksu" value="Juoksu" />
                 </RadioButton.Group>
               </Dialog.Content>
             </Dialog>
          </Portal>
         </Card.Content> 
       </Card>
 
       <Card style={styles.card}>
         <Card.Content style={styles.cardContent}>
           <Text style={styles.cardTitle}>Aika</Text>
           <DateTimePickerField
             label="Päivämäärä"
             labelStyle={styles.label}
             value={dateValue}
             mode="date"
             buttonLabel={formattedDate}
             onChange={handleDateSelected}
           />
           <DateTimePickerField
             label="Aloitusaika"
             labelStyle={styles.label}
             value={startTimeValue}
             mode="time"
             buttonLabel={startTime || "Valitse aloitusaika"}
             onChange={handleStartTimeSelected}
           />
         </Card.Content>
       </Card>
 
       <Card style={styles.card}>
         <Card.Content style={styles.cardContent}>
           <Text style={styles.cardTitle}>Sijainti</Text>
           <StartLocationPicker
             region={location}
             selectedCoordinate={selectedCoordinate}
             onSelect={handleSelectCoordinate}
             onRegionChangeComplete={setLocation}
           />
           {locationError ? (
             <Text style={styles.helperText}>{locationError}</Text>
           ) : null}
 
           <LocationFields
             inputStyle={styles.input}
             locationName={locationName}
             setLocationName={setLocationName}
             locationAddress={locationAddress}
             setLocationAddress={setLocationAddress}
             addressReadOnly
           />
         </Card.Content>
       </Card>
 
      <Pressable style={styles.addButton} onPress={handleFirebaseAddEvent}>
        <Text style={styles.buttonText}>Lisää tapahtuma</Text>
      </Pressable>
     </View>
   );
 }

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    width: "100%",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
  },
  cardContent: {
    gap: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  label: {
    fontWeight: "600",
  },
  helperText: {
    color: "#666",
    fontSize: 12,
  },
  addButton: {
    backgroundColor: "green",
    alignItems: "center",
    padding: 12,
    borderRadius: 5,
    margin: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});
