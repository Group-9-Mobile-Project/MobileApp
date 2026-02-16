import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import React, { useCallback } from "react";
import EventForm, { EventFormSubmitPayload } from "../components/Event/EventForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../context/AuthContext";
import { createEvent } from "../services/eventService";
import { Event } from "../types/Event";
import globalStyles from "../themes/GlobalStyles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import { LinearGradient } from 'expo-linear-gradient'
import { Colors } from "../constants/colors";

export default function CreateEventScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

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

        navigation.navigate("Koti");
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
    <LinearGradient colors={[Colors.dark.background, Colors.dark.inversePrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          style={globalStyles.container}
          contentContainerStyle={globalStyles.contentContainer}
          keyboardShouldPersistTaps="handled"
          //  enableOnAndroid 
          extraScrollHeight={24}
        >
          <EventForm onSubmit={handleSubmit} />
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}
