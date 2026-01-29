import React from "react";
import { StyleProp, TextInput, TextStyle, View, StyleSheet } from "react-native";

type LocationFieldsProps = {
  inputStyle: StyleProp<TextStyle>;
  locationName: string;
  setLocationName: (value: string) => void;
  locationAddress: string;
  setLocationAddress: (value: string) => void;
  latitudeInput: string;
  setLatitudeInput: (value: string) => void;
  longitudeInput: string;
  setLongitudeInput: (value: string) => void;
};

export function LocationFields({
  inputStyle,
  locationName,
  setLocationName,
  locationAddress,
  setLocationAddress,
  latitudeInput,
  setLatitudeInput,
  longitudeInput,
  setLongitudeInput,
}: LocationFieldsProps) {
  return (
    <View style={styles.fieldGroup}>
      <TextInput
        style={inputStyle}
        placeholder="Sijainnin nimi"
        value={locationName}
        onChangeText={setLocationName}
      />
      <TextInput
        style={inputStyle}
        placeholder="Osoite"
        value={locationAddress}
        onChangeText={setLocationAddress}
      />
      <TextInput
        style={inputStyle}
        placeholder="Latitude"
        value={latitudeInput}
        onChangeText={setLatitudeInput}
        keyboardType="numeric"
      />
      <TextInput
        style={inputStyle}
        placeholder="Longitude"
        value={longitudeInput}
        onChangeText={setLongitudeInput}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 12, 
  },
});