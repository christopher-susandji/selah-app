import { StyleSheet, Text } from "react-native";

interface Props {
  elapsedSec: number;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // padStart ensures 2 digits for minutes and seconds
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
}

export default function Timer({ elapsedSec }: Props) {
  return <Text style={styles.display}>{formatTime(elapsedSec)}</Text>;
}

const styles = StyleSheet.create({
  display: {
    fontSize: 80,
    fontWeight: "200",
    color: "#3D2C4E",
    letterSpacing: 4,
    fontVariant: ["tabular-nums"],
  },
});
