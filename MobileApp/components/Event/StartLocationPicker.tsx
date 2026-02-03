import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

type Coordinate = { latitude: number; longitude: number };

type StartLocationPickerProps = {
  region: Region;
  selectedCoordinate: Coordinate;
  onSelect: (coordinate: Coordinate) => void;
  onRegionChangeComplete: (region: Region) => void;
};

export default function StartLocationPicker({
  region,
  selectedCoordinate,
  onSelect,
  onRegionChangeComplete,
}: StartLocationPickerProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        onPress={(event) => onSelect(event.nativeEvent.coordinate)}
        showsUserLocation
      >
        <Marker coordinate={selectedCoordinate} />
      </MapView>
      <Text style={styles.helperText}>
        Napauta karttaa valitaksesi lähtöpaikan.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  map: {
    width: "100%",
    height: 220,
    borderRadius: 12,
  },
  helperText: {
    color: "#666",
    fontSize: 12,
  },
});
