import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface Props {
  elapsedSec: number;
  isRunning: boolean;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // padStart ensures 2 digits for minutes and seconds
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${mm}:${ss}`;
}

export default function Timer({ elapsedSec, isRunning }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRunning) return;

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.995,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [elapsedSec]);

  return (
    <Animated.Text style={[styles.display, { transform: [{ scale }] }]}>
      {formatTime(elapsedSec)}
    </Animated.Text>
  );
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
