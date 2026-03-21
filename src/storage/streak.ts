import { StreakInfo } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "selah:streak";

// For first launch
const DEFAULT_STREAK: StreakInfo = {
  currentStreakDays: 0,
  lastSessionDate: "",
  longestStreakDays: 0,
};

export async function getStreakInfo(): Promise<StreakInfo> {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  if (raw === null) {
    return DEFAULT_STREAK;
  }
  return JSON.parse(raw) as StreakInfo;
}

export async function updateStreak(todayDate: string): Promise<StreakInfo> {
  const streak = await getStreakInfo();

  // Case 1: Already did a session today, no change
  if (streak.lastSessionDate === todayDate) {
    return streak;
  }

  // Case 2: Did a session yesterday, increment streak
  const wasYesterday = isYesterday(streak.lastSessionDate, todayDate);

  const newStreakDays = wasYesterday ? streak.currentStreakDays + 1 : 1;
  const updated: StreakInfo = {
    currentStreakDays: newStreakDays,
    lastSessionDate: todayDate,
    longestStreakDays: Math.max(streak.longestStreakDays, newStreakDays),
  };

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
  return updated;
}

function isYesterday(previousDate: string, currentDate: string): boolean {
  if (!previousDate) return false; // no previous session
  // Parse both dates into Date objects at midnight UTC
  const prev = new Date(previousDate + "T00:00:00Z");
  const curr = new Date(currentDate + "T00:00:00Z");

  // Difference in milliseconds → convert to days
  const diffMs = curr.getTime() - prev.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays === 1;
}
