import { StyleSheet, Text, View } from "react-native";

interface Props {
  days?: number;
}

export default function StreakBanner({ days = 0 }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Streak</Text>
      <Text style={styles.count}>
        {days > 0 ? `${days} ${days === 1 ? "day" : "days"}` : "Begin today"}
      </Text>
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
