import FocusSetupChecklist from "@/components/FocusSetupChecklist";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FocusSetupScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top section: heading */}
        <View style={styles.top}>
          <Text style={styles.heading}>Focus Setup</Text>
          <Text style={styles.subheading}>
            Prepare your environment for a focused session.
          </Text>
        </View>

        {/* Middle section: checklist */}
        <View style={styles.middle}>
          <FocusSetupChecklist />
        </View>

        {/* Bottom section: start button */}
        <View style={styles.bottom}>
          <Text style={styles.readyText}>Ready when you are.</Text>
          <Pressable
            style={styles.startButton}
            onPress={() => router.push("/session")}
            android_ripple={{ color: "#FAF8F5" }}
          >
            {({ pressed }) => (
              <Text style={[styles.startButtonText, pressed && styles.pressed]}>
                Start Session
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
    paddingBottom: 32,
  },
  top: {
    marginTop: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3D2C4E",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "300",
    color: "#9B8FA0",
    lineHeight: 24,
  },
  middle: {
    gap: 8,
  },
  bottom: {
    gap: 12,
  },
  readyText: {
    textAlign: "center",
    fontSize: 14,
    color: "#9B8FA0",
    fontStyle: "italic",
  },
  startButton: {
    backgroundColor: "#3D2C4E",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  startButtonText: {
    color: "#FAF8F5",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.75,
  },
});
