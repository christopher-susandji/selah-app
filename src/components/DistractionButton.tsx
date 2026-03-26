import { Colors } from "@/constants/colors";
import { Radii, Spacing, Type } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  count: number;
  onPress: () => void;
}

export default function DistractionButton({ count, onPress }: Props) {
  function handlePress() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onPress();
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePress}
        style={styles.button}
        android_ripple={{ color: "#E0E0E0", radius: 24 }}
      >
        {({ pressed }) => (
          <Text style={[styles.buttonText, pressed && styles.pressed]}>
            I got distracted
          </Text>
        )}
      </Pressable>

      {count > 0 && (
        <Text style={styles.count}>
          {count} {count === 1 ? "time" : "times"} this session
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: Spacing[2],
  },
  button: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.md,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[7],
  },
  buttonText: {
    ...Type.labelMd,
    color: Colors.secondary,
  },
  pressed: {
    opacity: 0.5,
  },
  count: {
    ...Type.bodySm,
  },
});
