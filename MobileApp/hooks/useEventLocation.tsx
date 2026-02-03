import { useCallback, useEffect, useRef, useState } from "react";
import * as ExpoLocation from "expo-location";
import { Region } from "react-native-maps";

type Coordinate = { latitude: number; longitude: number };

type UseEventLocationOptions = {
  defaultCoordinate: Coordinate;
  defaultRegion: Region;
  setLocationName: (value: string) => void;
  setLocationAddress: (value: string) => void;
  setLatitudeInput: (value: string) => void;
  setLongitudeInput: (value: string) => void;
  autoFetch?: boolean;
};

export function useEventLocation({
  defaultCoordinate,
  defaultRegion,
  setLocationName,
  setLocationAddress,
  setLatitudeInput,
  setLongitudeInput,
  autoFetch = true,
}: UseEventLocationOptions) {
  const [location, setLocation] = useState<Region>(defaultRegion);
  const [selectedCoordinate, setSelectedCoordinate] = useState(defaultCoordinate);
  const [locationError, setLocationError] = useState<string | null>(null);

  const reverseGeocodeRequestId = useRef(0);

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
          setLocationAddress(formattedAddress);
        }
        const name = place?.name || place?.street || place?.city || "";
        if (name) {
          setLocationName(name);
        }
      } catch (error) {
        console.warn("Reverse geocode failed", error);
      }
    },
    [setLocationAddress, setLocationName]
  );

  const refreshCurrentLocation = useCallback(async () => {
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

      setLocation((prev) => ({ ...prev, ...coordinate }));
      setSelectedCoordinate(coordinate);
      setLatitudeInput(coordinate.latitude.toString());
      setLongitudeInput(coordinate.longitude.toString());

      await applyReverseGeocode(coordinate);
    } catch (error) {
      console.warn("Location fetch failed", error);
      setLocationError("Sijainnin haku epäonnistui.");
    }
  }, [applyReverseGeocode, setLatitudeInput, setLongitudeInput]);

  const handleSelectCoordinate = useCallback(
    async (coordinate: Coordinate) => {
      setSelectedCoordinate(coordinate);
      setLocation((prev) => ({ ...prev, ...coordinate }));
      setLatitudeInput(coordinate.latitude.toString());
      setLongitudeInput(coordinate.longitude.toString());

      await applyReverseGeocode(coordinate);
    },
    [applyReverseGeocode, setLatitudeInput, setLongitudeInput]
  );

  const resetLocation = useCallback(() => {
    setLocation(defaultRegion);
    setSelectedCoordinate(defaultCoordinate);
    setLocationError(null);
  }, [defaultRegion, defaultCoordinate]);

  useEffect(() => {
    if (autoFetch) {
      refreshCurrentLocation();
    }
  }, [autoFetch, refreshCurrentLocation]);

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
