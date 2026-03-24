import { Session } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSIONS_KEY = "selah:sessions";
const IN_PROGRESS_KEY = "selah:inProgress";

export async function saveSession(session: Session): Promise<void> {
  const existing = await getAllSessions();
  const updated = [session, ...existing];
  await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
}

export async function getAllSessions(): Promise<Session[]> {
  const raw = await AsyncStorage.getItem(SESSIONS_KEY);
  if (raw === null) {
    return [];
  }
  return JSON.parse(raw) as Session[];
}

export async function getSessionsByDate(date: string): Promise<Session[]> {
  const all = await getAllSessions();
  return all.filter((session) => {
    // session.startAt is an ISO 8601 string e.g. "2026-03-19T08:30:00.000Z"
    // .slice(0, 10) extracts just the "YYYY-MM-DD" part
    return session.startAt.slice(0, 10) === date;
  });
}

export async function markSessionInProgress(startAt: string): Promise<void> {
  await AsyncStorage.setItem(IN_PROGRESS_KEY, startAt);
}

export async function clearSessionInProgress(): Promise<void> {
  await AsyncStorage.removeItem(IN_PROGRESS_KEY);
}

export async function getInterruptedSession(): Promise<string | null> {
  return AsyncStorage.getItem(IN_PROGRESS_KEY);
}
