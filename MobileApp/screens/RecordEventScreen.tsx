import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import React, { useMemo, useRef, useEffect, useState } from "react";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useRouteRecorder } from "../hooks/useRouteRecorder";

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}.${String(m).padStart(2, "0")}.${String(s).padStart(2, "0")}`;
}

function haversineMeters(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number }
): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;

  const sin1 = Math.sin(dLat / 2);
  const sin2 = Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(sin1 * sin1 + Math.cos(lat1) * Math.cos(lat2) * sin2 * sin2),
      Math.sqrt(1 - (sin1 * sin1 + Math.cos(lat1) * Math.cos(lat2) * sin2 * sin2))
    );

  return R * c;
}

export default function RecordEventScreen() {
  const route = useRoute<RouteProp<RootTabParamList, "Tallenna tapahtuma">>();
  const { eventId } = route.params;
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const {
    route: recordedRoute,
    elapsedSeconds,
    steps,
    isPedometerAvailable,
    status,
    locationError,
    startNew,
    pauseRecording,
    resumeRecording,
    stopAndFinalize,
  } = useRouteRecorder({ eventId });

  const isRecording = status === "recording";
  const isPaused = status === "paused";
  const hasData = recordedRoute.length > 0 || elapsedSeconds > 0 || steps > 0;

  const [hasCentered, setHasCentered] = useState(false);

  useEffect(() => {
    if (recordedRoute.length === 0 && elapsedSeconds === 0) {
      setHasCentered(false);
    }
  }, [recordedRoute.length, elapsedSeconds]);

  const polylinePoints = useMemo(
    () =>
      recordedRoute.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      })),
    [recordedRoute]
  );

  const totalDistanceMeters = useMemo(() => {
    if (polylinePoints.length < 2) return 0;
    let total = 0;
    for (let i = 1; i < polylinePoints.length; i += 1) {
      total += haversineMeters(polylinePoints[i - 1], polylinePoints[i]);
    }
    return total;
  }, [polylinePoints]);

  const distanceKm = totalDistanceMeters / 1000;
  const estimatedSteps = Math.round(totalDistanceMeters / 0.78);

  const displayedSteps =
    isPedometerAvailable === true ? steps : estimatedSteps;

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    let isMounted = true;

    const centerToCurrentLocation = async () => {
      if (hasCentered || polylinePoints.length > 0) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!isMounted) return;

      const region: Region = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      mapRef.current?.animateToRegion(region, 600);
      setHasCentered(true);
    };

    centerToCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, [hasCentered, polylinePoints.length]);

  useEffect(() => {
    if (polylinePoints.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(polylinePoints, {
        edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
        animated: true,
      });
    }
  }, [polylinePoints]);

  const startPoint = polylinePoints[0];
  const endPoint = polylinePoints[polylinePoints.length - 1];

  const handlePrimaryPress = async () => {
    if (status === "idle") {
      await startNew();
    } else if (status === "recording") {
      pauseRecording();
    } else if (status === "paused") {
      await resumeRecording();
    }
  };

  const handleStopPress = () => {
    if (!hasData) return;

    Alert.alert(
      "Lopeta treeni",
      "Haluatko tallentaa treenin ja lopettaa tallennuksen?",
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Lopeta",
          style: "destructive",
          onPress: async () => {
            await stopAndFinalize();
            navigation.navigate("Harjoituksen tiedot", { eventId });
          },
        },
      ]
    );
  };

  const primaryLabel = isRecording
    ? "Keskeytä"
    : isPaused
    ? "Jatka"
    : "Aloita treeni";

  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(elapsedSeconds)}</Text>
      <Text style={styles.timeLabel}>Aika</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>
            {isPedometerAvailable === true ? displayedSteps : `~${displayedSteps}`}
          </Text>
          <Text style={styles.metricLabel}>Askeleet</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>{distanceKm.toFixed(2)}km</Text>
          <Text style={styles.metricLabel}>Matka</Text>
        </View>
      </View>

      <MapView
        ref={(ref) => {
          mapRef.current = ref;
        }}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
      >
        {polylinePoints.length > 0 && (
          <Polyline coordinates={polylinePoints} strokeWidth={4} />
        )}
        {startPoint && <Marker coordinate={startPoint} title="Start" />}
        {endPoint && <Marker coordinate={endPoint} title="Loppu" />}
      </MapView>

      {locationError && <Text style={styles.errorText}>{locationError}</Text>}

      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={handlePrimaryPress}
      >
        <Text style={styles.primaryButtonText}>{primaryLabel}</Text>
      </Pressable>

      <Pressable
        disabled={!hasData}
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.secondaryButtonPressed,
          !hasData && styles.secondaryButtonDisabled,
        ]}
        onPress={handleStopPress}
      >
        <Text
          style={[
            styles.secondaryButtonText,
            !hasData && styles.secondaryButtonTextDisabled,
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: "white",
  },
  timeText: {
    fontSize: 56,
    fontWeight: "700",
    textAlign: "center",
  },
  timeLabel: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricBlock: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "600",
  },
  metricLabel: {
    fontSize: 16,
    color: "#888",
  },
  map: {
    height: 320,
    borderRadius: 12,
    overflow: "hidden",
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
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
