import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Event, EventType, Location } from "../../types/Event";
import { firestore, EVENT } from "../../firebase/Config";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { LocationFields } from "./LocationFields";
import StartLocationPicker from "./StartLocationPicker";
import * as ExpoLocation from "expo-location";
import { Region } from "react-native-maps";
import DateTimePickerField from "../Common/DateTimePickerField";
import { Card, Button as PaperButton, Dialog, Portal, RadioButton } from "react-native-paper";

const DEFAULT_COORDINATE = { latitude: 65.08, longitude: 25.48 };

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function AddEvent() {
  const { user } = useAuth();
  
  const [location, setLocation] = useState<Region>(DEFAULT_REGION);
   const [selectedCoordinate, setSelectedCoordinate] = useState(DEFAULT_COORDINATE);
   const [locationError, setLocationError] = useState<string | null>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [startTime, setStartTime] = useState("");
  const [startTimeValue, setStartTimeValue] = useState<Date>(new Date());
  
  const [type, setType] = useState<EventType>("Kävely");
  const [typeDialogVisible, setTypeDialogVisible] = useState(false);
  
  const openTypeDialog = () => setTypeDialogVisible(true);
  const closeTypeDialog = () => setTypeDialogVisible(false);
  
  const [date, setDate] = useState("");
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [locationName, setLocationName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [latitudeInput, setLatitudeInput] = useState(
    DEFAULT_COORDINATE.latitude.toString()
  );
  const [longitudeInput, setLongitudeInput] = useState(
    DEFAULT_COORDINATE.longitude.toString()
  );
  
  const openTypeMenu = () => setTypeDialogVisible(true);
  const closeTypeMenu = () => setTypeDialogVisible(false);
  
  const reverseGeocodeRequestId = useRef(0);
  
  const applyReverseGeocode = async (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    const requestId = ++reverseGeocodeRequestId.current;
  
    try {
      const [place] = await ExpoLocation.reverseGeocodeAsync(coordinate);
      if (requestId !== reverseGeocodeRequestId.current) {
        return;
      }
  
      const formattedAddress = formatAddress(place);
      if (formattedAddress) {
        setLocationAddress(formattedAddress);
      }
      const name = place?.name || place?.street || place?.city || "";
      if (name) {
        setLocationName(name);
      }
    } catch (error) {
      console.warn("Reverse geocode failed", error);
    }
  };


  const formatTime = (value: Date) =>
    new Intl.DateTimeFormat("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(value);
  
  const handleDateSelected = (selected: Date) => {
    setDateValue(selected);
    const iso = selected.toISOString().slice(0, 10);
    setDate(iso);
  };
  
  const handleStartTimeSelected = (selected: Date) => {
    setStartTimeValue(selected);
    setStartTime(formatTime(selected));
  };


  const formattedDate = date
    ? new Intl.DateTimeFormat("fi-FI", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
    : "Valitse päivämäärä";

  const formatAddress = (
    place?: ExpoLocation.LocationGeocodedAddress
  ): string => {
    if (!place) return "";
    const parts = [
      place.name,
      place.street,
      place.postalCode,
      place.city,
      place.region,
      place.country,
    ].filter(Boolean);
    return parts.join(", ");
  };
  
  const getCurrentLocation = async () => {
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Sijaintilupa ei ole käytössä.");
        return;
      }
  
      const currentLocation = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
  
      const coordinate = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
  
      setLocation((prev) => ({ ...prev, ...coordinate }));
      setSelectedCoordinate(coordinate);
      setLatitudeInput(coordinate.latitude.toString());
      setLongitudeInput(coordinate.longitude.toString());
  
      await applyReverseGeocode(coordinate);
    } catch (error) {
      console.warn("Location fetch failed", error);
      setLocationError("Sijainnin haku epäonnistui.");
    }
  };
  
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  function resetForm() {
    setTitle("");
    setDescription("");
    setDate("");
    setDateValue(new Date());
    setStartTime("");
    setLocationName("");
    setLocationAddress("");
    setLatitudeInput(DEFAULT_COORDINATE.latitude.toString());
    setLongitudeInput(DEFAULT_COORDINATE.longitude.toString());
    setShowDatePicker(false);
    setType("Kävely");
    setLocation(DEFAULT_REGION);
    setSelectedCoordinate(DEFAULT_COORDINATE);
    setLocationError(null);
  
    getCurrentLocation();
  }

  async function handleFirebaseAddEvent(): Promise<void> {
    const ownerEmail = user?.email;
    const organizerName = user?.displayName?.trim() || ownerEmail || "Tuntematon";

    if (!ownerEmail) {
      Alert.alert("Virhe", "Kirjaudu sisään ennen tapahtuman luontia");
      return;
    }
    if (!title || !date || !startTime) {
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
  
  const handleSelectCoordinate = async (coordinate: {
    latitude: number;
    longitude: number;
  }) => {
    setSelectedCoordinate(coordinate);
    setLocation((prev) => ({ ...prev, ...coordinate }));
    setLatitudeInput(coordinate.latitude.toString());
    setLongitudeInput(coordinate.longitude.toString());
  
    await applyReverseGeocode(coordinate);
  };

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
 
       <Button title="Lisää tapahtuma" onPress={handleFirebaseAddEvent} />
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
     backgroundColor: "lightgrey",
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
 });