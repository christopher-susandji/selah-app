import DistractionButton from "@/components/DistractionButton";
import Timer from "@/components/Timer";
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
          <Text style={styles.label}>SESSION IN PROGRESS</Text>
        </View>

        {/* Middle section: timer + distraction button */}
        <View style={styles.middle}>
          <Timer elapsedSec={elapsedSec} />
          <Text style={styles.cue}>Stay with the Scriptures.</Text>
          <DistractionButton
            count={distractionCount}
            onPress={handleDistraction}
          />
        </View>

        {/* Bottom section: pause/resume + finish button */}
        <View style={styles.bottom}>
          <Pressable
            style={styles.pauseButton}
            onPress={isRunning ? pause : resume}
            android_ripple={{ color: "#E0E0E0", radius: 24 }}
          >
            {({ pressed }) => (
              <Text style={[styles.pauseButtonText, pressed && styles.pressed]}>
                {isRunning ? "Pause" : "Resume"}
              </Text>
            )}
          </Pressable>

          <Pressable
            style={styles.finishButton}
            onPress={handleFinish}
            android_ripple={{ color: "#FAF8F5", radius: 24 }}
          >
            {({ pressed }) => (
              <Text
                style={[styles.finishButtonText, pressed && styles.pressed]}
              >
                Finish
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
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    letterSpacing: 2,
    color: "#9B8FA0",
    textTransform: "uppercase",
  },
  middle: {
    alignItems: "center",
    gap: 32,
  },
  cue: {
    fontSize: 16,
    color: "#9B8FA0",
    fontStyle: "italic",
  },
  bottom: {
    gap: 12,
  },
  pauseButton: {
    borderWidth: 1.5,
    borderColor: "#3D2C4E",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  pauseButtonText: {
    fontSize: 16,
    color: "#3D2C4E",
    fontWeight: "500",
  },
  finishButton: {
    backgroundColor: "#3D2C4E",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  finishButtonText: {
    color: "#FAF8F5",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  pressed: {
    opacity: 0.75,
  },
});
