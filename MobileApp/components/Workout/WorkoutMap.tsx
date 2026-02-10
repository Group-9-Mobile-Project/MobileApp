import React, { useEffect, useRef } from "react";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { StyleSheet } from "react-native";

type Coordinate = { latitude: number; longitude: number };

type WorkoutMapProps = {
  points: Coordinate[];
  initialRegion: Region;
  showUserLocation?: boolean;
  centerRegion?: Region | null;
};

export default function WorkoutMap({
  points,
  initialRegion,
  showUserLocation,
  centerRegion,
}: WorkoutMapProps) {
  const mapRef = useRef<MapView | null>(null);

  const startPoint = points[0];
  const endPoint = points[points.length - 1];

  useEffect(() => {
    if (points.length > 1 && mapRef.current) {
      mapRef.current.fitToCoordinates(points, {
        edgePadding: { top: 48, right: 48, bottom: 48, left: 48 },
        animated: true,
      });
    }
  }, [points]);

  useEffect(() => {
    if (centerRegion && mapRef.current) {
      mapRef.current.animateToRegion(centerRegion, 600);
    }
  }, [centerRegion]);

  return (
    <MapView
      ref={(ref) => {
        mapRef.current = ref;
      }}
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation={showUserLocation}
    >
      {points.length > 0 && <Polyline coordinates={points} strokeWidth={4} />}
      {startPoint && <Marker coordinate={startPoint} title="Start" />}
      {endPoint && <Marker coordinate={endPoint} title="Loppu" />}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 320,
    borderRadius: 12,
    overflow: "hidden"
  },
});
