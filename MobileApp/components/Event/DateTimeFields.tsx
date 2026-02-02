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
  showStartTimePicker: boolean;
  setShowStartTimePicker: (value: boolean) => void;
  startTimeValue: Date;
  handleStartTimeChange: (event: { type?: string }, selected?: Date) => void;
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
  showStartTimePicker,
  setShowStartTimePicker,
  startTimeValue,
  handleStartTimeChange
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
      
      <Text style={labelStyle}>Aloitusaika</Text>
      <Button
        title={startTime || "Valitse aloitusaika"}
        onPress={() => setShowStartTimePicker(true)}
      />

      {showStartTimePicker && (
        <View style={datePickerContainerStyle}>
          <DateTimePicker
            value={startTimeValue}
            mode="time"
            display={Platform.OS === "android" ? "clock" : "spinner"}
            locale="fi-FI"
            onChange={handleStartTimeChange}
          />
          <Button title="Valmis" onPress={() => setShowStartTimePicker(false)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: 12,
  },
});