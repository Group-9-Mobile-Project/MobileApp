import { View, Text, TextInput, Alert, Pressable } from "react-native";
import React, { useCallback, useState } from "react";
import { Event, EventType, Location } from "../../types/Event";
import { LocationFields } from "./LocationFields";
import StartLocationPicker from "./StartLocationPicker";
import { Region } from "react-native-maps";
import DateTimePickerField from "../Common/DateTimePickerField";
import { Card, Button as PaperButton, Dialog, Portal, RadioButton } from "react-native-paper";
import { useEventForm } from "../../hooks/useEventForm";
import { useEventLocation } from "../../hooks/useEventLocation";
import globalStyles from "../../themes/GlobalStyles";

const DEFAULT_COORDINATE = { latitude: 65.08, longitude: 25.48 };

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export type EventFormSubmitPayload = {
  title: string;
  description: string;
  date: string;
  type: EventType;
  startTime: string;
  location: Location;
};

type EventFormProps = {
  initialEvent?: Event;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  onSubmit: (payload: EventFormSubmitPayload) => Promise<boolean>;
};

export default function EventForm({
  initialEvent,
  submitLabel,
  resetOnSuccess,
  onSubmit,
}: EventFormProps) {
  const [typeDialogVisible, setTypeDialogVisible] = useState(false);

  const openTypeDialog = () => setTypeDialogVisible(true);
  const closeTypeDialog = () => setTypeDialogVisible(false);

  const initialCoordinate =
    initialEvent?.location.coordinates ?? DEFAULT_COORDINATE;

  const initialRegion: Region = {
    ...DEFAULT_REGION,
    latitude: initialCoordinate.latitude,
    longitude: initialCoordinate.longitude,
  };

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
  } = useEventForm({
    defaultCoordinate: initialCoordinate,
    initialValues: initialEvent
      ? {
        title: initialEvent.title,
        description: initialEvent.description,
        date: initialEvent.date,
        startTime: initialEvent.startTime,
        type: initialEvent.type,
        locationName: initialEvent.location.name,
        locationAddress: initialEvent.location.address,
        latitude: initialEvent.location.coordinates.latitude,
        longitude: initialEvent.location.coordinates.longitude,
      }
      : undefined,
  });

  const handleCoordinateChange = useCallback(
    (coordinate: { latitude: number; longitude: number }) => {
      setLatitudeInput(coordinate.latitude.toString());
      setLongitudeInput(coordinate.longitude.toString());
    },
    [setLatitudeInput, setLongitudeInput]
  );

  const {
    location,
    setLocation,
    selectedCoordinate,
    locationError,
    handleSelectCoordinate,
    refreshCurrentLocation,
    resetLocation,
  } = useEventLocation({
    defaultCoordinate: initialCoordinate,
    defaultRegion: initialRegion,
    autoFetch: !initialEvent,
    onResolvedName: setLocationName,
    onResolvedAddress: setLocationAddress,
    onCoordinateChange: handleCoordinateChange,
  });

  const shouldResetOnSuccess = resetOnSuccess ?? !initialEvent;
  const resolvedSubmitLabel =
    submitLabel ?? (initialEvent ? "Tallenna muutokset" : "Lisää tapahtuma");

  function resetAll() {
    resetForm();
    resetLocation();
    if (!initialEvent) {
      refreshCurrentLocation(true);
    }
  }

  async function handleSubmit(): Promise<void> {
    const validation = validateForm();
    if (!validation.ok) {
      Alert.alert("Virhe", validation.message);
      return;
    }

    const { latitude, longitude } = validation;

    const payload: EventFormSubmitPayload = {
      title,
      description,
      date,
      type,
      startTime,
      location: {
        name: locationName,
        address: locationAddress,
        coordinates: {
          latitude,
          longitude,
        },
      },
    };

    const ok = await onSubmit(payload);

    if (ok && shouldResetOnSuccess) {
      resetAll();
    }
  }

  return (
    <View style={globalStyles.EventFormContainer}>
      <Card style={globalStyles.cardContainer}>
        <Card.Content style={globalStyles.cardContent}>
          <Text style={globalStyles.heading}>Perustiedot</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Tapahtuman nimi"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[globalStyles.input, globalStyles.multiline]}
            placeholder="Kuvaus (valinnainen)"
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={globalStyles.label}>Tyyppi</Text>
          <PaperButton mode="outlined" onPress={openTypeDialog} textColor='black'>
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

      <Card style={globalStyles.cardContainer}>
        <Card.Content style={globalStyles.basicInfoView}>
          <Text style={globalStyles.heading}>Aika</Text>
          <DateTimePickerField
            label="Päivämäärä"
            labelStyle={globalStyles.label}
            value={dateValue}
            mode="date"
            buttonLabel={formattedDate}
            onChange={handleDateSelected}
          />
          <DateTimePickerField
            label="Aloitusaika"
            labelStyle={globalStyles.label}
            value={startTimeValue}
            mode="time"
            buttonLabel={startTime || "Valitse aloitusaika"}
            onChange={handleStartTimeSelected}
          />
        </Card.Content>
      </Card>

      <Card style={globalStyles.cardContainer}>
        <Card.Content style={globalStyles.cardContent}>
          <Text style={globalStyles.heading}>Sijainti</Text>
          <StartLocationPicker
            region={location}
            selectedCoordinate={selectedCoordinate}
            onSelect={handleSelectCoordinate}
            onRegionChangeComplete={setLocation}
          />
          {locationError ? (
            <Text style={globalStyles.helperText}>{locationError}</Text>
          ) : null}
        </Card.Content>
        <Card.Content>
          <LocationFields
            inputStyle={globalStyles.input}
            locationName={locationName}
            setLocationName={setLocationName}
            locationAddress={locationAddress}
            setLocationAddress={setLocationAddress}
            addressReadOnly
          />
        </Card.Content>
      </Card>

      <Pressable style={globalStyles.addButton} onPress={handleSubmit}>
        <Text style={globalStyles.buttonText}>{resolvedSubmitLabel}</Text>
      </Pressable>
    </View>
  );
}
