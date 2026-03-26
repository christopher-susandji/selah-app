import DistractionButton from "@/components/DistractionButton";
import Timer from "@/components/Timer";
import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import { useAppState } from "@/hooks/useAppState";
import { useConditionalKeepAwake } from "@/hooks/useKeepAwake";
import { useTimer } from "@/hooks/useTimer";
import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SessionScreen() {
  // – Hooks
  const { elapsedSec, isRunning, start, pause, resume, reset } = useTimer();
  const { appState, leaveCount, resetLeaveCount } = useAppState();

  // Screen awake only when timer is running
  useConditionalKeepAwake(isRunning);

  // – State
  const [distractionCount, setDistractionCount] = useState(0);
  const startAtRef = useRef<string>(new Date().toISOString()); // store once
  const [showReturnCue, setShowReturnCue] = useState(false);
  const cueTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // – Effects
  useEffect(() => {
    start(); // only runs once on screen mount
  }, []);

  const prevAppStateRef = useRef(appState);
  useEffect(() => {
    const wasBackground = prevAppStateRef.current.match(/inactive|background/);
    const isNowActive = appState === "active";

    if (wasBackground && isNowActive) {
      Alert.alert(
        "Welcome back.",
        "Do you want to resume your session or end it?",
        [
          {
            text: "Finish session",
            onPress: handleFinish,
          },
          {
            text: "Continue",
            style: "cancel",
            onPress: resume,
          },
        ],
      );
    }
    prevAppStateRef.current = appState;
  }, [appState]);

  // – Handlers
  function handleDistraction() {
    setDistractionCount((count) => count + 1);

    setShowReturnCue(true);
    if (cueTimeoutRef.current) clearTimeout(cueTimeoutRef.current);
    cueTimeoutRef.current = setTimeout(() => {
      setShowReturnCue(false);
    }, 3000);
  }

  function handleFinish() {
    pause();
    router.replace({
      pathname: "/finish",
      params: {
        startAt: startAtRef.current,
        elapsedSec: String(elapsedSec),
        distractionTaps: String(distractionCount),
        leaveAppCount: String(leaveCount),
      },
    });
  }

  useEffect(() => {
    return () => {
      if (cueTimeoutRef.current) clearTimeout(cueTimeoutRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Disables the swipe-back gesture for this screen only */}
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <View style={styles.container}>
        {/* Top section: label */}
        <View style={styles.top}>
          <Text style={styles.label}>Session in Progress</Text>
        </View>

        {/* Middle section: timer + distraction button */}
        <View style={styles.middle}>
          <Timer elapsedSec={elapsedSec} isRunning={isRunning} />
          <Text style={styles.cue}>
            {showReturnCue
              ? "Gently return to the Scriptures."
              : "Stay with the Scriptures."}
          </Text>
          <DistractionButton
            count={distractionCount}
            onPress={handleDistraction}
          />
        </View>

        {/* Bottom section: pause/resume + finish button */}
        <View style={styles.bottom}>
          <Pressable
            onPress={isRunning ? pause : resume}
            android_ripple={{ color: "#E0E0E0", radius: 24 }}
          >
            {({ pressed }) => (
              <View style={[styles.pauseButton, pressed && styles.pressed]}>
                <Text style={styles.pauseButtonText}>
                  {isRunning ? "Pause" : "Resume"}
                </Text>
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={handleFinish}
            android_ripple={{ color: "#FAF8F5", radius: 24 }}
          >
            {({ pressed }) => (
              <View style={[styles.finishButton, pressed && styles.pressed]}>
                <Text style={styles.finishButtonText}>Finish</Text>
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
    alignItems: "center",
  },
  label: {
    ...Type.labelSm,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  middle: {
    alignItems: "center",
    gap: Spacing[8],
  },
  cue: {
    fontFamily: Fonts.newsreaderItalic,
    fontStyle: "italic",
    fontSize: 17,
    lineHeight: 26,
    color: Colors.textSecondary,
  },
  bottom: {
    gap: Spacing[3],
  },
  pauseButton: {
    backgroundColor: Colors.surfaceContainerHigh,
    paddingVertical: Spacing[4],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  pauseButtonText: {
    ...Type.labelLg,
    color: Colors.primaryContainer,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  finishButtonText: {
    ...Type.labelLg,
    color: Colors.onPrimary,
  },
  pressed: {
    opacity: 0.82,
  },
});
