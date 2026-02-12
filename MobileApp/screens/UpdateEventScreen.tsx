import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import EventForm, { EventFormSubmitPayload } from "../components/Event/EventForm";
import { Event } from "../types/Event";
import { getEventById, updateEvent } from "../services/eventService";
import { RootTabParamList } from "../types/Navigation";
import { useAuth } from "../context/AuthContext";
import globalStyles from "../themes/GlobalStyles";

type RouteParams = {
  eventId: string;
};

export default function UpdateEventScreen() {
  const route = useRoute<RouteProp<RootTabParamList, "Muokkaa tapahtumaa">>();
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { eventId } = route.params;

  const { user } = useAuth();
  const ownerEmail = user?.email;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    setLoading(true);
    setEvent(null);

    const load = async () => {
      try {
        const data = await getEventById(eventId);
        if (isMounted) {
          setEvent(data);
        }
      } catch (err) {
        console.error("Failed to fetch event", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const isOwner = !!event && !!ownerEmail && event.ownerEmail === ownerEmail;

  const handleSubmit = useCallback(
    async (payload: EventFormSubmitPayload): Promise<boolean> => {
      if (!isOwner) {
        Alert.alert("Ei oikeutta", "Sinulla ei ole oikeutta muokata tätä tapahtumaa.");
        return false;
      }

      try {
        await updateEvent(eventId, payload);
        Alert.alert("Onnistui", "Tapahtuma päivitetty");
        navigation.goBack();
        return true;
      } catch (err) {
        console.error("Failed to update event", err);
        Alert.alert("Virhe", "Tapahtuman päivitys epäonnistui");
        return false;
      }
    },
    [eventId, isOwner, navigation]
  );

  if (loading) {
    return (
      <View style={globalStyles.centered}>
        <ActivityIndicator size="large" />
        <Text style={globalStyles.helperText}>Haetaan tapahtumaa...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={globalStyles.centered}>
        <Text style={globalStyles.helperText}>Tapahtumaa ei löytynyt.</Text>
      </View>
    );
  }

  if (!isOwner) {
    return (
      <View style={globalStyles.centered}>
        <Text style={globalStyles.helperText}>
          Sinulla ei ole oikeutta muokata tätä tapahtumaa.
        </Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={globalStyles.linkText}>Palaa takaisin</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        style={globalStyles.container}
        contentContainerStyle={globalStyles.contentContainer}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={24}
      >
        <EventForm
          key={event.id}
          initialEvent={event}
          submitLabel="Tallenna muutokset"
          resetOnSuccess={false}
          onSubmit={handleSubmit}
        />
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}