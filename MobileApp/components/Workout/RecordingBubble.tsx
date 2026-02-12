import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootTabParamList } from "../../types/Navigation";
import { useRecordingContext } from "../../context/RecordingContext";

export default function RecordingBubble() {
  const { activeEventId, status } = useRecordingContext();
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const insets = useSafeAreaInsets();

  const isVisible = !!activeEventId && (status === "recording" || status === "paused");
  if (!isVisible) return null;

  return (
    <View style={[styles.wrapper, { bottom: insets.bottom + 84 }]}>
      <Pressable onPress={() => navigation.navigate("Tallenna tapahtuma", { eventId: activeEventId! })} style={styles.button}>
        <Ionicons name={status === "paused" ? "pause-circle" : "radio-button-on"} size={22} color="white" />
       
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    right: 16,
    zIndex: 1000,
    elevation: 12
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#d32f2f",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 999
  },
});
