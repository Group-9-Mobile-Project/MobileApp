import React, { useState } from "react";
import {
  Button,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateTimePickerFieldProps = {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  value: Date;
  mode: "date" | "time";
  onChange: (value: Date) => void;
  locale?: string;
  buttonLabel: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

export default function DateTimePickerField({
  label,
  labelStyle,
  value,
  mode,
  onChange,
  locale = "fi-FI",
  buttonLabel,
  minimumDate,
  maximumDate,
}: DateTimePickerFieldProps) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value);

  const open = () => {
    setDraft(value);
    setShow(true);
  };

  const close = () => {
    setShow(false);
  };

  const confirm = () => {
    onChange(draft);
    setShow(false);
  };

  const handleChange = (event: { type?: string }, selected?: Date) => {
    if (!selected) return;

    if (Platform.OS === "android") {
      if (event.type === "set") {
        onChange(selected);
      }
      setShow(false);
      return;
    }

    setDraft(selected);
  };

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <Button title={buttonLabel} onPress={open} />

      {show && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={Platform.OS === "ios" ? draft : value}
            mode={mode}
            display={Platform.OS === "ios" ? "spinner" : (mode === "date" ? "calendar" : "clock")}
            locale={locale}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          {Platform.OS === "ios" && (
            <View style={styles.actions}>
              <Button title="Peruuta" onPress={close} />
              <Button title="Valmis" onPress={confirm} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  pickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  actions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
