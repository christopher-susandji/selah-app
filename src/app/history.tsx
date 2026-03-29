import SessionCard from "@/components/SessionCard";
import StreakBanner from "@/components/StreakBanner";
import { Colors } from "@/constants/colors";
import { Fonts, Spacing, Type } from "@/constants/theme";
import { getAllSessions } from "@/storage/sessions";
import { getStreakInfo } from "@/storage/streak";
import { Session, StreakInfo } from "@/types/session";
import { Stack, useFocusEffect } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface SectionData {
  title: string;
  dateKey: string;
  data: Session[];
}

// – Helpers
function formatDateHeader(dateKey: string): string {
  // Append T12:00:00 to ensure correct date parsing regardless of timezone
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("default", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function groupSessionsByDate(sessions: Session[]): SectionData[] {
  const grouped = sessions.reduce<Record<string, Session[]>>((acc, session) => {
    const dateKey = session.startAt.slice(0, 10); // Extract YYYY-MM-DD
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(session);
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([dateKey, sessions]) => ({
      title: formatDateHeader(dateKey),
      dateKey,
      data: sessions,
    }))
    .sort((a, b) => b.dateKey.localeCompare(a.dateKey)); // Sort by date descending
}

function getWeeklySummary(sessions: Session[]): {
  count: number;
  totalMin: number;
} {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thisWeek = sessions.filter((s) => new Date(s.startAt) >= sevenDaysAgo);
  const totalSec = thisWeek.reduce(
    (sum, session) => sum + session.elapsedSec,
    0,
  );

  return {
    count: thisWeek.length,
    totalMin: Math.floor(totalSec / 60),
  };
}

// – Screen
export default function HistoryScreen() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [weeklySummary, setWeeklySummary] = useState({ count: 0, totalMin: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        setIsLoading(true);

        try {
          // Load sessions and streak in parallel using Promise.all
          const [allSessions, streak] = await Promise.all([
            getAllSessions(),
            getStreakInfo(),
          ]);

          setSections(groupSessionsByDate(allSessions));
          setStreakInfo(streak);
          setWeeklySummary(getWeeklySummary(allSessions));
        } catch (error) {
          console.error("Error loading history data:", error);
        } finally {
          setIsLoading(false);
        }
      }

      loadData();
    }, []),
  );

  // Handle loading state
  if (isLoading) {
    return (
      <SafeAreaProvider style={styles.safe}>
        <Stack.Screen options={screenOptions} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  // Handle empty state
  if (sections.length === 0) {
    return (
      <SafeAreaProvider style={styles.safe}>
        <Stack.Screen options={screenOptions} />
        <View style={styles.centered}>
          <Text style={styles.emptyHeading}>No sessions yet</Text>
          <Text style={styles.emptySubtext}>
            Ready to start your first session?
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // Header component
  const ListHeader = (
    <View style={styles.listHeader}>
      {streakInfo && <StreakBanner days={streakInfo.currentStreakDays} />}

      <View style={styles.weeklySummary}>
        <Text style={styles.weeklyTitle}>This week</Text>
        <Text style={styles.weeklyStats}>
          {weeklySummary.count} session{weeklySummary.count !== 1 && "s"},{" "}
          {weeklySummary.totalMin} min
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.safe}>
      <Stack.Screen options={screenOptions} />
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <SessionCard session={item} />
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{section.title}</Text>
          </View>
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled
      />
    </SafeAreaProvider>
  );
}

const screenOptions: ExtendedStackNavigationOptions = {
  headerShown: true,
  title: "History",
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: Colors.primary,
  headerTitleStyle: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 20,
    fontWeight: "normal",
    color: Colors.textPrimary,
  },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Colors.background },
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[2],
  },
  emptyHeading: {
    ...Type.headlineSm,
    fontFamily: Fonts.newsreaderRegular,
  },
  emptySubtext: {
    ...Type.bodyMd,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingBottom: Spacing[10],
  },
  listHeader: {
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing[6],
    paddingBottom: Spacing[6],
    gap: Spacing[5],
  },
  weeklySummary: {
    gap: Spacing[1],
  },
  weeklyTitle: {
    ...Type.labelSm,
    textTransform: "uppercase",
  },
  weeklyStats: {
    fontFamily: Fonts.dmSerifDisplay,
    fontSize: 26,
    lineHeight: 34,
    color: Colors.textPrimary,
  },
  sectionHeader: {
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing[5],
    paddingBottom: Spacing[2],
  },
  sectionHeaderText: {
    ...Type.labelSm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.gutter,
    // Living Library: 3.5rem (Spacing 10 ≈ 56px) vertical whitespace between items
    marginBottom: Spacing[4],
  },
});
