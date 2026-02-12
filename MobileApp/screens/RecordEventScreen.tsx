import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import React, { useMemo, useEffect, useState } from "react";
import { useRoute, RouteProp, useNavigation, NavigationProp } from "@react-navigation/native";
import { RootTabParamList } from "../types/Navigation";
import * as Location from "expo-location";
import { Region } from "react-native-maps";
import { useRouteRecorder } from "../hooks/useRouteRecorder";
import WorkoutStatsHeader from "../components/Workout/WorkoutStatsHeader";
import WorkoutMap from "../components/Workout/WorkoutMap";
import WorkoutControls from "../components/Workout/WorkoutControls";
import { useRecordingContext } from "../context/RecordingContext";

const DEFAULT_REGION: Region = {
  latitude: 65.08,
  longitude: 25.48,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

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

  const { setActiveRecording, clearActiveRecording } = useRecordingContext();
  
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

  const [centerRegion, setCenterRegion] = useState<Region | null>(null);

  const polylinePoints = useMemo(
    () =>
      recordedRoute.map((point) => ({
        latitude: point.latitude,
        longitude: point.longitude,
      })),
    [recordedRoute]
  );
  useEffect(() => {
    if (status === "recording" || status === "paused") {
      setActiveRecording(eventId, status);
    } else {
      clearActiveRecording();
    }
  }, [status, eventId, setActiveRecording, clearActiveRecording]);

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

  useEffect(() => {
    let isMounted = true;

    const centerToCurrentLocation = async () => {
      if (polylinePoints.length > 0) return;

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!isMounted) return;

      setCenterRegion({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    };

    centerToCurrentLocation();

    return () => {
      isMounted = false;
    };
  }, [polylinePoints.length]);

  const handlePrimaryPress = async () => {
    if (status === "idle") {
      const started = await startNew();
      if (!started) {
        Alert.alert(
          "Treenin tallennus",
          "Tälle tapahtumalle on jo tallennettu treeni. Poista se ennen uuden aloittamista."
        );
      }
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
            try {
              await stopAndFinalize();
              clearActiveRecording();
              navigation.navigate("Harjoituksen tiedot", { eventId });
            } catch (error) {
              const message = error instanceof Error ? error.message : "";
              if (message === "FINAL_EXISTS_FOR_EVENT") {
                Alert.alert(
                  "Treenin tallennus",
                  "Tälle tapahtumalle on jo tallennettu treeni. Poista se ennen uuden aloittamista."
                );
                return;
              }
              Alert.alert("Virhe", "Treenin tallennus epäonnistui.");
            }
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
      
        <WorkoutStatsHeader
          elapsedSeconds={elapsedSeconds}
          steps={displayedSteps}
          distanceKm={distanceKm}
          isStepsEstimated={isPedometerAvailable !== true}
        />

        <WorkoutMap
          points={polylinePoints}
          initialRegion={DEFAULT_REGION}
          showUserLocation
          centerRegion={centerRegion}
        />

        {locationError && <Text style={styles.errorText}>{locationError}</Text>}

        <WorkoutControls
          primaryLabel={primaryLabel}
          onPrimaryPress={handlePrimaryPress}
          onStopPress={handleStopPress}
          disableStop={!hasData}
        />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
    gap: 4,
    backgroundColor: "white",
  },
  errorText: {
    color: "#c62828",
    textAlign: "center",
  },
});