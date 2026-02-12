import React from "react";
import { StyleProp, TextInput, TextStyle, View, StyleSheet } from "react-native";
import globalStyles from "../../themes/GlobalStyles";

type LocationFieldsProps = {
  inputStyle: StyleProp<TextStyle>;
  locationName: string;
  setLocationName: (value: string) => void;
  locationAddress: string;
  setLocationAddress: (value: string) => void;
  addressReadOnly?: boolean;
};

export function LocationFields({
  inputStyle,
  locationName,
  setLocationName,
  locationAddress,
  setLocationAddress,
  addressReadOnly = false,
}: LocationFieldsProps) {
  return (
    <View style={globalStyles.fieldGroup}>
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
        editable={!addressReadOnly}
        selectTextOnFocus={!addressReadOnly}
      />
    </View>
  );
}