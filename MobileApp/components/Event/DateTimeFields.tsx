import React from "react";
import { Button, Platform, StyleProp, Text, TextInput, TextStyle, View, ViewStyle, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateTimeFieldsProps = {
  labelStyle: StyleProp<TextStyle>;
  inputStyle: StyleProp<TextStyle>;
  datePickerContainerStyle: StyleProp<ViewStyle>;
  formattedDate: string;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  dateValue: Date;
  handleDateChange: (event: { type?: string }, selected?: Date) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
};

export function DateTimeFields({
  labelStyle,
  inputStyle,
  datePickerContainerStyle,
  formattedDate,
  showDatePicker,
  setShowDatePicker,
  dateValue,
  handleDateChange,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: DateTimeFieldsProps) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={labelStyle}>Päivämäärä</Text>
      <Button title={formattedDate} onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <View style={datePickerContainerStyle}>
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

      <TextInput
        style={inputStyle}
        placeholder="Alkaa (HH:mm)"
        value={startTime}
        onChangeText={setStartTime}
      />
      <TextInput
        style={inputStyle}
        placeholder="Päättyy (HH:mm)"
        value={endTime}
        onChangeText={setEndTime}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 12,
  },
});