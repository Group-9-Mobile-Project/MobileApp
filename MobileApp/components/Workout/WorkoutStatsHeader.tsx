import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/colors";
import globalStyles from '../../themes/GlobalStyles'
import { Spacing } from "../../themes/spacing";

type WorkoutStatsHeaderProps = {
  elapsedSeconds: number;
  steps: number;
  distanceKm: number;
  isStepsEstimated?: boolean;
};

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}.${String(m).padStart(2, "0")}.${String(s).padStart(2, "0")}`;
}

export default function WorkoutStatsHeader({
  elapsedSeconds,
  steps,
  distanceKm,
  isStepsEstimated,
}: WorkoutStatsHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.timeText}>{formatTime(elapsedSeconds)}</Text>
      <Text style={styles.timeLabel}>Aika</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>
            {isStepsEstimated ? `~${steps}` : steps}
          </Text>
          <Text style={styles.metricLabel}>Askeleet</Text>
        </View>
        <View style={styles.metricBlock}>
          <Text style={styles.metricValue}>{distanceKm.toFixed(2)}km</Text>
          <Text style={styles.metricLabel}>Matka</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  timeText: {
    fontSize: 56,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.dark.onSurface,
  },
  timeLabel: {
    fontSize: 20,
    color: Colors.dark.primary,
    textAlign: "center",
    marginBottom: 8,
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
    color: Colors.dark.onSurface,
  },
  metricLabel: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
});
