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
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type Display = "default" | "spinner" | "calendar" | "clock";

type DateTimePickerFieldProps = {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  value: Date;
  mode: "date" | "time";
  onChange: (value: Date) => void;
  locale?: string;
  buttonLabel: string;
  display?: Display;
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
  const isAndroid = Platform.OS === "android";
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (!show) {
      setDraft(value);
    }
  }, [value, show]);

  const resolvedDisplay =
    display ?? (Platform.OS === "ios" ? "spinner" : "default");

  const handleAndroidChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    if (event.type === "set" && selected) {
      onChange(selected);
    }
  };

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    setDraft(selected);
  };

  const open = () => {
    if (isAndroid) {
      DateTimePickerAndroid.open({
        value,
        mode,
        display: resolvedDisplay,
        onChange: handleAndroidChange,
        minimumDate,
        maximumDate,
        is24Hour: true,
      });
      return;
    }

    setDraft(value);
    setShow(true);
  };

  const close = () => {
    setShow(false);
    setDraft(value);
  };

  const confirm = () => {
    onChange(draft);
    setShow(false);
  };

  return (
    <View style={styles.container}>
      <Text style={labelStyle}>{label}</Text>
      <Button title={buttonLabel} onPress={open} />

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
