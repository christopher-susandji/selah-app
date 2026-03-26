import FocusSetupChecklist from "@/components/FocusSetupChecklist";
import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FocusSetupScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top section: breadcrumb nav + heading */}
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
            onPress={() => router.push("/session")}
            android_ripple={{ color: "#FAF8F5" }}
          >
            {({ pressed }) => (
              <View style={[styles.startButton, pressed && styles.pressed]}>
                <Text style={styles.startButtonText}>Start Session</Text>
              </View>
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.gutter,
    justifyContent: "space-between",
    paddingBottom: Spacing[8],
  },
  top: {
    marginTop: Spacing[10],
    paddingRight: Spacing[10], // intentional asymmetry
  },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  subheading: {
    ...Type.bodyMd,
    color: Colors.textSecondary,
  },
  middle: {
    gap: Spacing[2],
  },
  bottom: {
    gap: Spacing[3],
  },
  readyText: {
    textAlign: "center",
    ...Type.labelMd,
    fontFamily: Fonts.newsreaderItalic,
    fontStyle: "italic",
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  startButtonText: {
    ...Type.labelLg,
    color: Colors.onPrimary,
  },
  pressed: {
    opacity: 0.82,
  },
});
