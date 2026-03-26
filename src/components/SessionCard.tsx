import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
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
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    gap: Spacing[2],
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    ...Type.labelMd,
  },
  duration: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: 20,
    lineHeight: 26,
    color: Colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  stat: {
    ...Type.bodySm,
  },
  dot: {
    ...Type.bodySm,
  },
  reflection: {
    ...Type.bodySm,
    fontFamily: Fonts.newsreaderItalic,
    fontStyle: "italic",
    color: Colors.textPrimary,
    marginTop: Spacing[1],
    lineHeight: 20,
  },
});
