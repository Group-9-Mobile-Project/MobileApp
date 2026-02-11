import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";

type WorkoutControlsProps = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  onStopPress: () => void;
  disableStop?: boolean;
};

export default function WorkoutControls({
  primaryLabel,
  onPrimaryPress,
  onStopPress,
  disableStop,
}: WorkoutControlsProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={onPrimaryPress}
      >
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </Pressable>

      <Pressable
        disabled={disableStop}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.secondaryButtonPressed,
          disableStop && styles.secondaryButtonDisabled,
        ]}
        onPress={onStopPress}
      >
        <Text
          style={[
            styles.secondaryButtonText,
            disableStop && styles.secondaryButtonTextDisabled,
          ]}
        >
          Lopeta treeni
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6
  },
  primaryButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  secondaryButtonPressed: {
    opacity: 0.7,
  },
  secondaryButtonDisabled: {
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: "#444",
  },
  secondaryButtonTextDisabled: {
    color: "#888",
  },
});
