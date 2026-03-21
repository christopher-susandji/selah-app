import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  count: number;
  onPress: () => void;
}

export default function DistractionButton({ count, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
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
    gap: 8,
  },
  button: {
    borderWidth: 1.5,
    borderColor: "#9B8FA0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  buttonText: {
    fontSize: 15,
    color: "#9B8FA0",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.5,
  },
  count: {
    fontSize: 13,
    color: "#9B8FA0",
  },
});
