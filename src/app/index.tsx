import StreakBanner from "@/components/StreakBanner";
import { getAllSessions } from "@/storage/sessions";
import { getStreakInfo } from "@/storage/streak";
import { Session, StreakInfo } from "@/types/session";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
          const [sessions, streak] = await Promise.all([
            getAllSessions(),
            getStreakInfo(),
          ]);
          setStreakInfo(streak);
          // index 0 is the most recent session due to sorting in getAllSessions
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
        {/* --- Top section: greeting --- */}
        <View style={styles.top}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.greetingSub}>Ready for your next session?</Text>
        </View>

        {/* --- Middle section: streak banner --- */}
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
