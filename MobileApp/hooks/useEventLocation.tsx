import { useCallback, useEffect, useRef, useState } from "react";
import * as ExpoLocation from "expo-location";
import { Region } from "react-native-maps";

type Coordinate = { latitude: number; longitude: number };

type UseEventLocationOptions = {
  defaultCoordinate: Coordinate;
  defaultRegion: Region;
  autoFetch?: boolean;
  onResolvedName?: (value: string) => void;
  onResolvedAddress?: (value: string) => void;
  onCoordinateChange?: (coordinate: Coordinate) => void;
  reverseGeocodeDelayMs?: number;
};

export function useEventLocation({
  defaultCoordinate,
  defaultRegion,
  autoFetch = true,
  onResolvedName,
  onResolvedAddress,
  onCoordinateChange,
  reverseGeocodeDelayMs = 600,
}: UseEventLocationOptions) {
  const [location, setLocation] = useState<Region>(defaultRegion);
  const [selectedCoordinate, setSelectedCoordinate] = useState(defaultCoordinate);
  const [locationError, setLocationError] = useState<string | null>(null);

  const reverseGeocodeRequestId = useRef(0);
  const reverseGeocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const manualSelectionRef = useRef(false);

  const formatAddress = (
    place?: ExpoLocation.LocationGeocodedAddress
  ): string => {
    if (!place) return "";
    const parts = [
      place.name,
      place.street,
      place.postalCode,
      place.city,
      place.region,
      place.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const applyReverseGeocode = useCallback(
    async (coordinate: Coordinate) => {
      const requestId = ++reverseGeocodeRequestId.current;

      try {
        const [place] = await ExpoLocation.reverseGeocodeAsync(coordinate);
        if (requestId !== reverseGeocodeRequestId.current) {
          return;
        }

        const formattedAddress = formatAddress(place);
        if (formattedAddress) {
          onResolvedAddress?.(formattedAddress);
        }
        const name = place?.name || place?.street || place?.city || "";
        if (name) {
          onResolvedName?.(name);
        }
      } catch (error) {
        console.warn("Reverse geocode failed", error);
      }
    },
    [onResolvedAddress, onResolvedName]
  );

  const scheduleReverseGeocode = useCallback(
    (coordinate: Coordinate) => {
      if (reverseGeocodeTimer.current) {
        clearTimeout(reverseGeocodeTimer.current);
      }
      reverseGeocodeTimer.current = setTimeout(() => {
        applyReverseGeocode(coordinate);
      }, reverseGeocodeDelayMs);
    },
    [applyReverseGeocode, reverseGeocodeDelayMs]
  );

  const refreshCurrentLocation = useCallback(
    async (force = false) => {
      if (manualSelectionRef.current && !force) {
        return;
      }

      try {
        const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationError("Sijaintilupa ei ole käytössä.");
          return;
        }

        const currentLocation = await ExpoLocation.getCurrentPositionAsync({
          accuracy: ExpoLocation.Accuracy.Balanced,
        });

        const coordinate = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        if (manualSelectionRef.current && !force) {
          return;
        }

        setLocation((prev) => ({ ...prev, ...coordinate }));
        setSelectedCoordinate(coordinate);
        onCoordinateChange?.(coordinate);

        scheduleReverseGeocode(coordinate);
      } catch (error) {
        console.warn("Location fetch failed", error);
        setLocationError("Sijainnin haku epäonnistui.");
      }
    },
    [onCoordinateChange, scheduleReverseGeocode]
  );

  const handleSelectCoordinate = useCallback(
    async (coordinate: Coordinate) => {
      manualSelectionRef.current = true;

      setSelectedCoordinate(coordinate);
      setLocation((prev) => ({ ...prev, ...coordinate }));
      onCoordinateChange?.(coordinate);

      scheduleReverseGeocode(coordinate);
    },
    [onCoordinateChange, scheduleReverseGeocode]
  );

  const resetLocation = useCallback(() => {
    manualSelectionRef.current = false;
    setLocation(defaultRegion);
    setSelectedCoordinate(defaultCoordinate);
    setLocationError(null);
  }, [defaultRegion, defaultCoordinate]);

  useEffect(() => {
    if (autoFetch) {
      refreshCurrentLocation();
    }
  }, [autoFetch, refreshCurrentLocation]);

  useEffect(() => {
    return () => {
      if (reverseGeocodeTimer.current) {
        clearTimeout(reverseGeocodeTimer.current);
      }
    };
  }, []);

  return {
    location,
    setLocation,
    selectedCoordinate,
    locationError,
    handleSelectCoordinate,
    refreshCurrentLocation,
    resetLocation,
  };
}
