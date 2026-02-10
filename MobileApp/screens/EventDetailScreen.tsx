import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { loadRouteFinal} from "../services/routeStorage";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import { RouteFinal } from "../services/routeStorage";

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

export default function EventDetailScreen() {
  const route = useRoute<RouteProp<RootTabParamList, "Harjoituksen tiedot">>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const [data, setData] = useState<RouteFinal | null>(null);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef<MapView | null>(null);

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

  const points = useMemo(
    () =>
      (data?.route ?? []).map((p) => ({
        latitude: p.latitude,
        longitude: p.longitude,
      })),
    [data]
  );

  useEffect(() => {
    if (points.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
        animated: true,
      });
    }
  }, [points]);

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

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Harjoituksen tiedot</Text>
      <Text style={styles.meta}>
        {startedAt.toLocaleString()}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{formatDuration(data.elapsedSeconds)}</Text>
          <Text style={styles.statLabel}>Kesto</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{distanceKm.toFixed(2)} km</Text>
          <Text style={styles.statLabel}>Matka</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{data.steps}</Text>
          <Text style={styles.statLabel}>Askeleet</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{avgSpeedKmh.toFixed(1)} km/h</Text>
          <Text style={styles.statLabel}>Keskinopeus</Text>
        </View>
      </View>

      <MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        style={styles.map}
        initialRegion={points.length ? {
          latitude: points[0].latitude,
          longitude: points[0].longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : DEFAULT_REGION}
      >
        {points.length > 0 && <Polyline coordinates={points} strokeWidth={4} />}
        {startPoint && <Marker coordinate={startPoint} title="Start" />}
        {endPoint && <Marker coordinate={endPoint} title="Loppu" />}
      </MapView>

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
  heading: { fontSize: 20, fontWeight: "700" },
  meta: { color: "#666" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },
  statBlock: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "600" },
  statLabel: { color: "#777" },
  map: { height: 320, borderRadius: 12, overflow: "hidden" },
  backButton: {
    marginTop: 12,
    backgroundColor: "black",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: { color: "white", fontWeight: "600" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  link: { color: "#1e88e5" },
});
