import React, { useEffect, useState } from "react";
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
  display?: "default" | "spinner" | "calendar" | "clock" | "inline";
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
  display,
  minimumDate,
  maximumDate,
}: DateTimePickerFieldProps) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!show) {
      setDraft(value);
    }
  }, [value, show]);

  const resolvedDisplay =
    display ??
    (Platform.OS === "ios"
      ? "spinner"
      : mode === "date"
        ? "calendar"
        : "clock");

  const open = () => {
    setDraft(value);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setDraft(value);
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

  const confirm = () => {
    onChange(draft);
    setShow(false);
  };

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <Button title={buttonLabel} onPress={open} />

      {Platform.OS === "android" && show && (
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={value}
            mode={mode}
            display={resolvedDisplay}
            locale={locale}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>
      )}

      {Platform.OS === "ios" && show && (
        <View style={styles.inlinePickerContainer}>
          <DateTimePicker
            value={draft}
            mode={mode}
            display={resolvedDisplay}
            locale={locale}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          <View style={styles.inlineActions}>
            <Button title="Peruuta" onPress={close} />
            <Button title="Valmis" onPress={confirm} />
          </View>
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
    marginTop: 8,
  },
  inlinePickerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  inlineActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
