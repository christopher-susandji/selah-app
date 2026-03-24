import { clearSessionInProgress, saveSession } from "@/storage/sessions";
import { updateStreak } from "@/storage/streak";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// – Helpers
// Format seconds into human-friendly string, e.g. 1m 20s
function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

// Generate a unique ID for the session record
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTodayLocalDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function FinishScreen() {
  // – Session data from route params
  const { startAt, elapsedSec, distractionTaps, leaveAppCount } =
    useLocalSearchParams<{
      startAt: string;
      elapsedSec: string;
      distractionTaps: string;
      leaveAppCount: string;
    }>();

  const elapsedSecNum = parseInt(elapsedSec ?? "0", 10);
  const distractionTapsNum = parseInt(distractionTaps ?? "0", 10);
  const leaveAppCountNum = parseInt(leaveAppCount ?? "0", 10);

  // – Local state
  const [reflection, setReflection] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // – Save handler
  async function handleSave(reflectionText: string | null) {
    if (isSaving) return;
    setIsSaving(true);

    try {
      const endAt = new Date().toISOString();

      await saveSession({
        id: generateId(),
        startAt: startAt ?? endAt,
        endAt,
        elapsedSec: elapsedSecNum,
        distractionTaps: distractionTapsNum,
        leaveAppCount: leaveAppCountNum,
        reflection: reflectionText,
      });
      await clearSessionInProgress();
      await updateStreak(getTodayLocalDate());

      router.replace("/"); // navigate back to home after saving
    } catch (error) {
      console.error("Error saving session:", error);
      setIsSaving(false);
      // Task: optionally show an alert to the user about the failure
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/*
        KeyboardAvoidingView pushes content up when the keyboard appears
        so the TextInput is never hidden behind it.
        behavior differs by platform — 'padding' on iOS, 'height' on Android
      */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top section: heading */}
          <View style={styles.top}>
            <Text style={styles.heading}>Session complete.</Text>
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <SummaryRow label="Time" value={formatDuration(elapsedSecNum)} />
            <View style={styles.divider} />
            <SummaryRow
              label="Distractions"
              value={`${distractionTapsNum} tap${distractionTapsNum === 1 ? "" : "s"}`}
            />
            <View style={styles.divider} />
            <SummaryRow
              label="Left app"
              value={`${leaveAppCountNum} time${leaveAppCountNum === 1 ? "" : "s"}`}
            />
          </View>

          {/* Reflection input */}
          <View style={styles.reflectionSection}>
            <Text style={styles.reflectionPrompt}>
              What have you learned today?
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Optional..."
              placeholderTextColor="#C5BBCC"
              value={reflection}
              onChangeText={setReflection}
              editable={!isSaving}
              multiline
              returnKeyType="done"
              maxLength={500}
            />
          </View>

          {/* Actions */}
          <View style={styles.bottom}>
            <Pressable
              style={[styles.saveButton, isSaving && styles.disabled]}
              onPress={() => handleSave(reflection.trim() ? reflection : null)}
              disabled={isSaving}
              android_ripple={{ color: "#FAF8F5" }}
            >
              {({ pressed }) => (
                <Text
                  style={[styles.saveButtonText, pressed && styles.pressed]}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              )}
            </Pressable>

            <Pressable
              style={styles.skipLink}
              onPress={() => handleSave(null)}
              disabled={isSaving}
            >
              <Text style={styles.skipLinkText}>Skip reflection</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Component for single row in FinishScreen summary card, e.g. "Duration: 1m 20s"
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: "#FAF8F5",
  },
  scrollContent: {
    flexGrow: 1, // lets ScrollView fill height even when content is short
    paddingHorizontal: 28,
    paddingBottom: 32,
    gap: 32,
  },
  top: {
    marginTop: 48,
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#3D2C4E",
  },
  summaryCard: {
    backgroundColor: "#F5F0E8",
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between", // label on left, value on right
    alignItems: "center",
    paddingVertical: 14,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#9B8FA0",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3D2C4E",
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E1EF",
  },
  reflectionSection: {
    gap: 12,
  },
  reflectionPrompt: {
    fontSize: 17,
    fontWeight: "500",
    color: "#3D2C4E",
    lineHeight: 24,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: "#E8E1EF",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#3D2C4E",
    backgroundColor: "#FFFFFF",
  },
  bottom: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: "#3D2C4E",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FAF8F5",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  skipLink: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipLinkText: {
    color: "#9B8FA0",
    fontSize: 15,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
