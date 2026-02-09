import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { RoutePoint } from "../types/Event";
import { clearRoute, loadRoute, saveRoute } from "../services/routeStorage";

type UseRouteRecorderOptions = {
  eventId: string;
  timeIntervalMs?: number;
  distanceIntervalMeters?: number;
  accuracy?: Location.Accuracy;
  persistDebounceMs?: number;
};

export function useRouteRecorder({
  eventId,
  timeIntervalMs = 5000,
  distanceIntervalMeters = 5,
  accuracy = Location.Accuracy.Balanced,
  persistDebounceMs = 1500,
}: UseRouteRecorderOptions) {
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadRoute(eventId)
      .then((data) => {
        if (isMounted) {
          setRoute(data);
        }
      })
      .catch((error) => {
        console.warn("Failed to load route", error);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const persistRoute = useCallback(
    (nextRoute: RoutePoint[]) => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = setTimeout(() => {
        saveRoute(eventId, nextRoute).catch((error) => {
          console.warn("Failed to save route", error);
        });
      }, persistDebounceMs);
    },
    [eventId, persistDebounceMs]
  );

  useEffect(() => {
    if (route.length === 0) {
      return;
    }
    persistRoute(route);
  }, [route, persistRoute]);

  const startRecording = useCallback(async () => {
    if (subscriptionRef.current) {
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationError("Sijaintilupa ei ole käytössä.");
      return;
    }

    setLocationError(null);

    const subscription = await Location.watchPositionAsync(
      {
        accuracy,
        timeInterval: timeIntervalMs,
        distanceInterval: distanceIntervalMeters,
      },
      (location) => {
        const point: RoutePoint = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          timestamp: location.timestamp ?? Date.now(),
          accuracy: location.coords.accuracy ?? undefined,
          speed: location.coords.speed ?? undefined,
          altitude: location.coords.altitude ?? undefined,
        };

        setRoute((prev) => [...prev, point]);
      }
    );

    subscriptionRef.current = subscription;
    setIsRecording(true);
  }, [accuracy, distanceIntervalMeters, timeIntervalMs]);

  const stopRecording = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
    setIsRecording(false);
  }, []);

  const clearRecordedRoute = useCallback(async () => {
    stopRecording();
    setRoute([]);
    await clearRoute(eventId);
  }, [eventId, stopRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
    };
  }, [stopRecording]);

  return {
    route,
    isRecording,
    locationError,
    startRecording,
    stopRecording,
    clearRecordedRoute,
  };
}
