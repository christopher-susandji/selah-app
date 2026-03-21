import StreakBanner from "@/components/StreakBanner";
import { useTimer } from "@/hooks/useTimer";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { elapsedSec, isRunning, start, pause, resume } = useTimer();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* --- Top section: greeting --- */}
        <View style={styles.top}>
          <Text style={styles.greeting}>Good Afternoon,</Text>
          <Text style={styles.greetingSub}>Ready for your next session?</Text>
        </View>

        {/* --- Middle section: streak banner --- */}
        <View style={styles.middle}>
          <StreakBanner days={3} />
          <Text style={styles.lastSession}>Last session: 2 days ago</Text>
        </View>

        {/* --- Bottom section: actions --- */}
        <View style={styles.bottom}>
          <Link href="/focus-setup" asChild>
            <Pressable
              style={styles.primaryButton}
              android_ripple={{ color: "#FAF8F5" }}
            >
              {({ pressed }) => (
                <Text
                  style={[styles.primaryButtonText, pressed && styles.pressed]}
                >
                  Begin Session
                </Text>
              )}
            </Pressable>
          </Link>

          <Link href="/history" asChild>
            <Pressable style={styles.secondaryLink}>
              {({ pressed }) => (
                <Text
                  style={[styles.secondaryLinkText, pressed && styles.pressed]}
                >
                  View History
                </Text>
              )}
            </Pressable>
          </Link>
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
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: "#3D2C4E",
    lineHeight: 36,
  },
  greetingSub: {
    fontSize: 28,
    fontWeight: "300",
    color: "#3D2C4E",
    lineHeight: 36,
  },
  middle: {
    alignItems: "center",
    gap: 16,
  },
  lastSession: {
    fontSize: 14,
    color: "#9B8FA0",
  },
  bottom: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: "#3D2C4E",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FAF8F5",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.75,
  },
  secondaryLink: {
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryLinkText: {
    color: "#9B8FA0",
    fontSize: 15,
  },
});
