import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from "react-native";
import { Region } from "react-native-maps";
import { clearRouteDraft, clearRouteFinal, loadRouteFinal, RouteFinal } from "../services/routeStorage";
import { getEventById } from "../services/eventService";
import { useRoute, RouteProp, useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import WorkoutMap from "../components/Workout/WorkoutMap";
import WorkoutSummaryCard from "../components/Workout/WorkoutSummaryCard";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../constants/colors";
import globalStyles from '../themes/GlobalStyles'
import { Spacing } from "../themes/spacing";
import { EventType } from "../types/Event"
import { Ionicons } from "@expo/vector-icons";

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export default function ExerciseDetailScreen() {
  const route = useRoute<RouteProp<RootTabParamList, "Harjoituksen tiedot">>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const [data, setData] = useState<RouteFinal | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState<string | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      setLoading(true);

      loadRouteFinal(eventId)
        .then((finalData) => {
          if (mounted) setData(finalData);
        })
        .finally(() => {
          if (mounted) setLoading(false);
        });

      return () => {
        mounted = false;
      };
    }, [eventId])
  );

  useEffect(() => {
    let mounted = true;

    getEventById(eventId)
      .then((event) => {
        if (mounted) {
          setEventTitle(event?.title ?? null);
          setEventType(event?.type ?? null);
        }
      })
      .catch(() => {
        if (mounted) {
          setEventTitle(null);
          setEventType(null);
        }
      });

    return () => {
      mounted = false;
    };
  }, [eventId]);
  
  const handleDelete = () => {
    Alert.alert(
      "Poista harjoitus",
      "Haluatko poistaa tämän harjoituksen laitteelta?",
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await Promise.all([clearRouteFinal(eventId), clearRouteDraft(eventId)]);
              setData(null);
              navigation.navigate("Tilastot");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  const points = useMemo(
    () =>
      (data?.route ?? []).map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    [data]
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Haetaan harjoitusta...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.centered}>
        <Text>Harjoitusta ei löytynyt.</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Takaisin</Text>
        </Pressable>
      </View>
    );
  }

  const avgSpeedKmh = data.avgSpeedMs * 3.6;
  const distanceKm = data.distanceMeters / 1000;
  const startedAt = new Date(data.startedAt);
  const displayType = data.workoutType ?? eventType;

  return (
  <LinearGradient colors={[Colors.dark.background, Colors.dark.onPrimary, Colors.dark.background]} style={globalStyles.gradientBackground}>

    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={globalStyles.heading}>{eventTitle ?? "Harjoituksen tiedot"}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteIcon}>
          <Ionicons name="trash-outline" size={28} color="#d32f2f" />
        </Pressable>
      </View>
      <Text style={styles.meta}>{startedAt.toLocaleString()}</Text>
      {displayType && <Text style={styles.meta}>Tyyppi: {displayType}</Text>}

      <WorkoutSummaryCard
        durationSeconds={data.elapsedSeconds}
        distanceKm={distanceKm}
        steps={data.steps}
        avgSpeedKmh={avgSpeedKmh}
      />

      <WorkoutMap
        points={points}
        initialRegion={
          points.length
            ? {
              latitude: points[0].latitude,
              longitude: points[0].longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }
            : DEFAULT_REGION
        }
      />

      <Pressable style={styles.backButton} onPress={() => navigation.navigate("Tilastot")}>
        <Text style={styles.backButtonText}>Sulje</Text>
      </Pressable>
      </View>
    </LinearGradient>
  )
} 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12
  },
  heading: {
    fontSize: 20,
    fontWeight: "700"
  },
  meta: {
    color: Colors.dark.primary,
    padding: Spacing.xs
  },
  backButton: {
    marginTop: 12,
    backgroundColor: Colors.dark.secondary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "600"
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12
  },
  link: {
    color: "#1e88e5"
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteIcon: {
    padding: 12,
  },

});