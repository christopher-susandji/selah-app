import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import { markOnboardingComplete } from "@/storage/onboarding";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
  {
    heading: "A quiet space\nfor the Word.",
    body: "Selah helps you stay present during Bible reading — tracking your time and attention, without distraction.",
  },
  {
    heading: "Simple by\ndesign.",
    body: "Start a session, mark distractions as they come, and reflect when you're done. That's it.",
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  async function handleNext() {
    if (isLast) {
      await markOnboardingComplete();
      router.replace("/focus-setup");
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.heading}>{STEPS[step].heading}</Text>
          <Text style={styles.body}>{STEPS[step].body}</Text>
        </View>
        <View style={styles.bottom}>
          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === step && styles.dotActive]}
              />
            ))}
          </View>
          <Pressable onPress={handleNext} android_ripple={{ color: "#FAF8F5" }}>
            {({ pressed }) => (
              <View style={[styles.button, pressed && styles.pressed]}>
                <Text style={styles.buttonText}>
                  {isLast ? "Get Started" : "Next"}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing[8],
    justifyContent: "space-between",
  },
  top: { marginTop: Spacing[10], paddingRight: Spacing[10] },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 36,
    lineHeight: 46,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
    marginBottom: Spacing[5],
  },
  body: {
    ...Type.bodyLg,
    color: Colors.textSecondary,
    lineHeight: 26,
  },
  bottom: { gap: Spacing[5] },
  dots: { flexDirection: "row", gap: Spacing[2], justifyContent: "center" },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.outlineVariant,
  },
  dotActive: { backgroundColor: Colors.primary },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  buttonText: { ...Type.labelLg, color: Colors.onPrimary },
  pressed: { opacity: 0.82 },
});
