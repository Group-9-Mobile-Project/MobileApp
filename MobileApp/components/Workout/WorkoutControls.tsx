import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { Colors } from "../../constants/colors";
import globalStyles from '../../themes/GlobalStyles'
import { Spacing } from "../../themes/spacing";

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
        onPress={() => onPrimaryPress()}
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
        onPress={() => onStopPress()}
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
    backgroundColor: Colors.dark.secondaryContainer,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: Colors.dark.secondary,
    fontSize: 16,
    fontWeight: "600",
  },
 
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 8,        
    paddingHorizontal: 20,      
    borderRadius: 12,          
    backgroundColor: Colors.dark.onError   
  },
  secondaryButtonPressed: {
    opacity: 0.9,
  },
  secondaryButtonDisabled: {
    borderColor: "#888",        
    opacity: 0.5,
  },
  secondaryButtonTextDisabled: {
    color: "#888",
  },
  secondaryButtonText: {
    color: Colors.dark.error,
    fontWeight: "600",         
    fontSize: 14,              
  },
});
