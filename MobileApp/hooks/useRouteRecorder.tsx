import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { Pedometer } from "expo-sensors";
import { RoutePoint } from "../types/Event";
import {
  clearRouteDraft,
  loadRouteDraft,
  saveRouteDraft,
  saveRouteFinal,
} from "../services/routeStorage";

type RouteRecorderStatus = "idle" | "recording" | "paused";
type PermissionState = "granted" | "denied" | "undetermined";

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [steps, setSteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState<
    boolean | null
  >(null);
  const [pedometerPermission, setPedometerPermission] =
    useState<PermissionState>("undetermined");
  const [status, setStatus] = useState<RouteRecorderStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);

  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const stepSubscriptionRef = useRef<{ remove: () => void } | null>(null);
  const lastStepCountRef = useRef<number | null>(null);

  const persistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const elapsedRef = useRef(0);
  const stepsRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    elapsedRef.current = elapsedSeconds;
  }, [elapsedSeconds]);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  useEffect(() => {
    let isMounted = true;

    Pedometer.isAvailableAsync()
      .then((available) => {
        if (isMounted) setIsPedometerAvailable(available);
      })
      .catch((error) => {
        console.warn("Pedometer availability check failed", error);
        if (isMounted) setIsPedometerAvailable(false);
      });

    Pedometer.getPermissionsAsync()
      .then((perm) => {
        if (!isMounted) return;
        setPedometerPermission(perm.granted ? "granted" : "denied");
      })
      .catch(() => {
        if (isMounted) setPedometerPermission("undetermined");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadRouteDraft(eventId)
      .then((draft) => {
        if (!isMounted || !draft) return;

        setRoute(draft.route ?? []);
        setElapsedSeconds(draft.elapsedSeconds ?? 0);
        setSteps(draft.steps ?? 0);

        if ((draft.route?.length ?? 0) > 0 || draft.elapsedSeconds > 0) {
          setStatus("paused");
        }
      })
      .catch((error) => {
        console.warn("Failed to load draft route", error);
      });

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  const persistDraft = useCallback(
    (nextRoute: RoutePoint[], nextElapsed: number, nextSteps: number) => {
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      persistTimerRef.current = setTimeout(() => {
        saveRouteDraft(eventId, {
          route: nextRoute,
          elapsedSeconds: nextElapsed,
          steps: nextSteps,
          updatedAt: Date.now(),
        }).catch((error) => {
          console.warn("Failed to save draft route", error);
        });
      }, persistDebounceMs);
    },
    [eventId, persistDebounceMs]
  );

  useEffect(() => {
    if (status === "idle") return;
    if (route.length === 0 && elapsedSeconds === 0 && steps === 0) return;
    persistDraft(route, elapsedSeconds, steps);
  }, [route, elapsedSeconds, steps, status, persistDraft]);

  const ensurePedometerPermission = useCallback(async (): Promise<boolean> => {
    try {
      const perm = await Pedometer.getPermissionsAsync();
      if (perm.granted) {
        setPedometerPermission("granted");
        return true;
      }

      const req = await Pedometer.requestPermissionsAsync();
      setPedometerPermission(req.granted ? "granted" : "denied");
      return req.granted;
    } catch (error) {
      console.warn("Pedometer permission request failed", error);
      setPedometerPermission("undetermined");
      return false;
    }
  }, []);

  const startStepUpdates = useCallback(async () => {
    if (!isPedometerAvailable) return;
    if (stepSubscriptionRef.current) return;

    const granted = await ensurePedometerPermission();
    if (!granted) {
      console.warn("Pedometer permission not granted");
      return;
    }

    lastStepCountRef.current = null;
    stepSubscriptionRef.current = Pedometer.watchStepCount((result) => {
      if (lastStepCountRef.current === null) {
        lastStepCountRef.current = result.steps;
        return;
      }

      const delta = result.steps - lastStepCountRef.current;
      lastStepCountRef.current = result.steps;

      if (delta > 0) {
        setSteps((prev) => {
          const next = prev + delta;
          stepsRef.current = next;
          return next;
        });
      }
    });
  }, [ensurePedometerPermission, isPedometerAvailable]);

  const stopStepUpdates = useCallback(() => {
    stepSubscriptionRef.current?.remove();
    stepSubscriptionRef.current = null;
    lastStepCountRef.current = null;
  }, []);

  const startLocationUpdates = useCallback(async () => {
    if (subscriptionRef.current) return true;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLocationError("Sijaintilupa ei ole käytössä.");
      return false;
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
    return true;
  }, [accuracy, distanceIntervalMeters, timeIntervalMs]);

  const stopLocationUpdates = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  useEffect(() => {
    if (status !== "recording") {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      startTimeRef.current = null;
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - elapsedRef.current * 1000;
    }

    timerRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const diffSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      elapsedRef.current = diffSeconds;
      setElapsedSeconds(diffSeconds);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  const startNew = useCallback(async () => {
    await clearRouteDraft(eventId);
    setRoute([]);
    setElapsedSeconds(0);
    setSteps(0);
    elapsedRef.current = 0;
    stepsRef.current = 0;
    startTimeRef.current = null;

    const ok = await startLocationUpdates();
    if (ok) {
      await startStepUpdates();
      setStatus("recording");
    }
  }, [eventId, startLocationUpdates, startStepUpdates]);

  const pauseRecording = useCallback(() => {
    if (status !== "recording") return;
    stopLocationUpdates();
    stopStepUpdates();
    setStatus("paused");

    saveRouteDraft(eventId, {
      route,
      elapsedSeconds,
      steps,
      updatedAt: Date.now(),
    }).catch((error) => {
      console.warn("Failed to save draft route", error);
    });
  }, [elapsedSeconds, eventId, route, status, steps, stopLocationUpdates, stopStepUpdates]);

  const resumeRecording = useCallback(async () => {
    if (status !== "paused") return;

    const ok = await startLocationUpdates();
    if (ok) {
      await startStepUpdates();
      setStatus("recording");
    }
  }, [status, startLocationUpdates, startStepUpdates]);

  const stopAndFinalize = useCallback(async () => {
    stopLocationUpdates();
    stopStepUpdates();

    await saveRouteFinal(eventId, {
      route,
      elapsedSeconds,
      steps,
      finishedAt: Date.now(),
    });

    await clearRouteDraft(eventId);

    setStatus("idle");
  }, [elapsedSeconds, eventId, route, steps, stopLocationUpdates, stopStepUpdates]);

  useEffect(() => {
    return () => {
      stopLocationUpdates();
      stopStepUpdates();
      if (persistTimerRef.current) {
        clearTimeout(persistTimerRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stopLocationUpdates, stopStepUpdates]);

  return {
    route,
    elapsedSeconds,
    steps,
    isPedometerAvailable,
    pedometerPermission,
    status,
    locationError,
    startNew,
    pauseRecording,
    resumeRecording,
    stopAndFinalize,
  };
}
