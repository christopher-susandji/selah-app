import { StyleSheet, Text, View } from "react-native";

interface Props {
  days?: number;
  wasReset?: boolean;
}

export default function StreakBanner({ days = 0, wasReset = false }: Props) {
  function getLabel(): string {
    if (wasReset) {
      return "Today is a good day to begin again.";
    }
    if (days === 0) {
      return "Begin today";
    }
    return days === 1 ? "1 day" : `${days} days`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Daily rhythm</Text>
      <Text style={styles.count}>{getLabel()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    color: "#888",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  count: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
