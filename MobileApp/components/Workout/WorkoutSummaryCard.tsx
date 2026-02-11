import React from "react";
import { View, Text, StyleSheet } from "react-native";

type WorkoutSummaryCardProps = {
  durationSeconds: number;
  distanceKm: number;
  steps: number;
  avgSpeedKmh: number;
};

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

export default function WorkoutSummaryCard({
  durationSeconds,
  distanceKm,
  steps,
  avgSpeedKmh,
}: WorkoutSummaryCardProps) {
  return (
    <>
      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{formatDuration(durationSeconds)}</Text>
          <Text style={styles.statLabel}>Kesto</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{distanceKm.toFixed(2)} km</Text>
          <Text style={styles.statLabel}>Matka</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{steps}</Text>
          <Text style={styles.statLabel}>Askeleet</Text>
        </View>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{avgSpeedKmh.toFixed(1)} km/h</Text>
          <Text style={styles.statLabel}>Keskinopeus</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statBlock: {
    flex: 1,
    alignItems: "center"
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600"
  },
  statLabel: {
    color: "#777"
  },
});
