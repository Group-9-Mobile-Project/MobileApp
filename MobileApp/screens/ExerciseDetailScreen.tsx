import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { Region } from "react-native-maps";
import { loadRouteFinal } from "../services/routeStorage";
import { getEventById } from "../services/eventService";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import WorkoutMap from "../components/Workout/WorkoutMap";
import WorkoutSummaryCard from "../components/Workout/WorkoutSummaryCard";
import { RouteFinal } from "../services/routeStorage";

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

  useEffect(() => {
    let mounted = true;

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
  }, [eventId]);

  useEffect(() => {
    let mounted = true;

    getEventById(eventId)
      .then((event) => {
        if (mounted) setEventTitle(event?.title ?? null);
      })
      .catch(() => {
        if (mounted) setEventTitle(null);
      });

    return () => {
      mounted = false;
    };
  }, [eventId]);

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
  const startedAt = new Date(data.finishedAt);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{eventTitle ?? "Harjoituksen tiedot"}</Text>
      <Text style={styles.meta}>{startedAt.toLocaleString()}</Text>

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

      <Pressable style={styles.backButton} onPress={() => navigation.navigate("Koti")}>
        <Text style={styles.backButtonText}>Sulje</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    gap: 12
  },
  heading: {
    fontSize: 20,
    fontWeight: "700"
  },
  meta: {
    color: "#666"
  },
  backButton: {
    marginTop: 12,
    backgroundColor: "black",
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
});
