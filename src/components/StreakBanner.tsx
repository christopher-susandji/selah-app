import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
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
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
  },
  label: {
    ...Type.labelSm,
    textTransform: "uppercase",
    marginBottom: Spacing[1],
  },
  count: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
});
