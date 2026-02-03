import { StyleSheet,TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import React, { useCallback } from "react";
import EventForm, { EventFormSubmitPayload } from "../components/Event/EventForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../context/AuthContext";
import { createEvent } from "../services/eventService";
import { Event } from "../types/Event";

export default function CreateEventScreen() {
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (payload: EventFormSubmitPayload): Promise<boolean> => {
      const ownerEmail = user?.email;
      const organizerName = user?.displayName?.trim() || ownerEmail || "Tuntematon";

      if (!ownerEmail) {
        Alert.alert("Virhe", "Kirjaudu sisään ennen tapahtuman luontia");
        return false;
      }

      try {
        const eventPayload: Omit<Event, "id"> = {
          ...payload,
          attendees: [],
          organizer: organizerName,
          ownerEmail,
        };

        await createEvent(eventPayload);

        Alert.alert("Onnistui", "Tapahtuma luotu");
        return true;
      } catch (err) {
        console.error("Failed to save new event", err);
        Alert.alert("Virhe", "Tapahtuman tallennus epäonnistui");
        return false;
      }
    },
    [user]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        //  enableOnAndroid 
        extraScrollHeight={24}
      >
        <EventForm onSubmit={handleSubmit} />
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  }  
});
