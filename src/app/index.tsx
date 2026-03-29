import StreakBanner from "@/components/StreakBanner";
import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import {
  clearSessionInProgress,
  getAllSessions,
  getInterruptedSession,
} from "@/storage/sessions";
import { getStreakInfo } from "@/storage/streak";
import { Session, StreakInfo } from "@/types/session";
import { Ionicons } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// – Helpers
function getLastSessionLabel(isoString: string): string {
  const sessionDate = new Date(isoString);
  const now = new Date();
  const sessionDay = sessionDate.toLocaleDateString();
  const today = now.toLocaleDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayDay = yesterday.toLocaleDateString();

  if (sessionDay === today) return "today";
  if (sessionDay === yesterdayDay) return "yesterday";

  const diffMs = now.getTime() - sessionDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `${diffDays} days ago`;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning,";
  if (hour < 18) return "Good Afternoon,";
  return "Good Evening,";
}

export default function HomeScreen() {
  // – State
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [lastSession, setLastSession] = useState<Session | null>(null);

  // – Load streak and last session on focus
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          const [sessions, streak, interrupted] = await Promise.all([
            getAllSessions(),
            getStreakInfo(),
            getInterruptedSession(),
          ]);
          if (interrupted) {
            await clearSessionInProgress();
            Alert.alert(
              "Session Interrupted",
              "Your last session was interrupted. Don't worry, you can start a new one whenever you're ready!",
            );
          }
          setStreakInfo(streak);
          setLastSession(sessions[0] ?? null);
        } catch (error) {
          console.error("Error loading home screen data:", error);
        }
      }
      loadData();
    }, []),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* App bar: title + settings */}
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>Selah</Text>
          <Link href="/settings" asChild>
            <Pressable hitSlop={12}>
              {({ pressed }) => (
                <Ionicons
                  name="settings-sharp"
                  size={22}
                  color={pressed ? Colors.textTertiary : Colors.textSecondary}
                />
              )}
            </Pressable>
          </Link>
        </View>

        {/* Top: greeting — left-aligned with wide right margin */}
        <View style={styles.top}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.greetingSub}>Ready for your next session?</Text>
        </View>

        {/* Middle: streak + last session */}
        <View style={styles.middle}>
          <StreakBanner days={streakInfo?.currentStreakDays ?? 0} />
          {lastSession ? (
            <Text style={styles.lastSession}>
              Last session: {getLastSessionLabel(lastSession.startAt)}
            </Text>
          ) : (
            <Text style={styles.lastSession}>
              No sessions yet. Ready when you are.
            </Text>
          )}
        </View>

        {/* Bottom: actions */}
        <View style={styles.bottom}>
          <Link href="/focus-setup" asChild>
            <Pressable android_ripple={{ color: "#FAF8F5" }}>
              {({ pressed }) => (
                <View style={[styles.primaryButton, pressed && styles.pressed]}>
                  <Text style={styles.primaryButtonText}>Begin Session</Text>
                </View>
              )}
            </Pressable>
          </Link>

          <Link href="/history" asChild>
            <Pressable style={styles.secondaryLink}>
              {({ pressed }) => (
                <Text
                  style={[styles.secondaryLinkText, pressed && styles.dimmed]}
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
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.gutter,
    justifyContent: "space-between",
    paddingBottom: Spacing[8],
  },
  top: {
    paddingRight: Spacing[10], // intentional asymmetry — wide right margin
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Spacing[5],
    paddingBottom: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
  },
  topBarTitle: {
    fontFamily: Fonts.newsreaderItalic, // italic serif
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  greeting: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 30,
    lineHeight: 40,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  greetingSub: {
    fontFamily: Fonts.newsreaderLight,
    fontSize: 30,
    lineHeight: 40,
    letterSpacing: -0.2,
    color: Colors.textPrimary,
  },
  middle: {
    gap: Spacing[4],
  },
  lastSession: {
    ...Type.labelMd,
  },
  bottom: {
    gap: Spacing[3],
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
  },
  primaryButtonText: {
    ...Type.labelLg,
    color: Colors.onPrimary,
  },
  secondaryLink: {
    alignItems: "center",
    paddingVertical: Spacing[4],
  },
  secondaryLinkText: {
    ...Type.labelMd,
    color: Colors.onPrimaryFixedVariant,
  },
  pressed: {
    opacity: 0.82,
  },
  dimmed: {
    opacity: 0.55,
  },
});
