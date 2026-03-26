import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
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

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) return `${seconds}s`;
  if (seconds === 0) return `${minutes}m`;
  return `${minutes}m ${seconds}s`;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function getTodayLocalDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

export default function FinishScreen() {
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

  const [reflection, setReflection] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      router.dismissAll();
    } catch (error) {
      console.error("Error saving session:", error);
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
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
            <Text style={styles.heading}>Session{"\n"}complete.</Text>
          </View>

          {/* Summary card */}
          <View style={styles.summaryCard}>
            <SummaryRow label="Time" value={formatDuration(elapsedSecNum)} />
            <SummaryRow
              label="Distractions"
              value={`${distractionTapsNum} tap${distractionTapsNum === 1 ? "" : "s"}`}
            />
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
              placeholderTextColor={Colors.textPlaceholder}
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
              disabled={isSaving}
              onPress={() => handleSave(reflection.trim() ? reflection : null)}
              android_ripple={{ color: "#FAF8F5" }}
            >
              {({ pressed }) => (
                <View
                  style={[
                    styles.saveButton,
                    pressed && styles.pressed,
                    isSaving && styles.disabled,
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving ? "Saving..." : "Save"}
                  </Text>
                </View>
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

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing[8],
    gap: Spacing[8],
  },
  top: {
    marginTop: Spacing[10],
    paddingRight: Spacing[10],
  },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 36,
    lineHeight: 46,
    letterSpacing: -0.4,
    color: Colors.textPrimary,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    paddingHorizontal: Spacing[5],
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing[4],
  },
  summaryLabel: {
    ...Type.bodyMd,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: 17,
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  reflectionSection: {
    gap: Spacing[3],
  },
  reflectionPrompt: {
    ...Type.headlineSm,
    fontFamily: Fonts.newsreaderRegular,
  },
  textInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Type.bodyMd,
    color: Colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
  },
  bottom: {
    gap: Spacing[3],
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  saveButtonText: {
    ...Type.labelLg,
    color: Colors.onPrimary,
  },
  skipLink: {
    paddingVertical: Spacing[3],
    alignItems: "center",
  },
  skipLinkText: {
    ...Type.labelMd,
    color: Colors.onPrimaryFixedVariant,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
