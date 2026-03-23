import { Session } from "@/types/session";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  session: Session;
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SessionCard({ session }: Props) {
  return (
    <View style={styles.card}>
      {/* Top row: time + duration */}
      <View style={styles.topRow}>
        <Text style={styles.time}>{formatTime(session.startAt)}</Text>
        <Text style={styles.duration}>
          {formatDuration(session.elapsedSec)}
        </Text>
      </View>

      {/* Stats row: distractions + leaves */}
      <View style={styles.statsRow}>
        <Text style={styles.stat}>
          {session.distractionTaps}{" "}
          {session.distractionTaps === 1 ? "distraction" : "distractions"}
        </Text>
        {session.leaveAppCount > 0 && (
          <>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.stat}>left app {session.leaveAppCount}x</Text>
          </>
        )}
      </View>

      {/* Reflection (if any) */}
      {session.reflection && (
        <Text style={styles.reflection}>"{session.reflection}"</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#F5F0E8",
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 14,
    color: "#9B8FA0",
  },
  duration: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3D2C4E",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stat: {
    fontSize: 13,
    color: "#9B8FA0",
  },
  dot: {
    fontSize: 13,
    color: "#9B8FA0",
  },
  reflection: {
    fontSize: 13,
    color: "#3D2C4E",
    fontStyle: "italic",
    marginTop: 4,
    lineHeight: 18,
  },
});
