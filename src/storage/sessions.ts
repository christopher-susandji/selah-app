import { supabase } from "@/lib/supabase";
import { Session } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { syncAllSessions, syncSession } from "./sync";

const SESSIONS_KEY = "selah:sessions";
const IN_PROGRESS_KEY = "selah:inProgress";

export async function saveSession(session: Session): Promise<void> {
  try {
    const existing = await getAllSessions();
    const updated = [session, ...existing];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    throw new Error(`Failed to save session: ${error}`);
  }

  supabase.auth.getSession().then(({ data: { session: authSession } }) => {
    if (!authSession?.user) return;
    syncSession(session, authSession.user.id).catch((err) => {
      // fire and forget, avoid blocking user flow if sync fails
      console.warn("[sync] saveSession failed to sync:", err);
    });
  });
}

// Called after user signs in, uploads all local sessions to Supabase.
export async function syncExistingSessions(): Promise<void> {
  const {
    data: { session: authSession },
  } = await supabase.auth.getSession();
  if (!authSession?.user) return;

  const localSessions = await getAllSessions();
  await syncAllSessions(localSessions, authSession.user.id);
}

// Get all sessions from local storage.
export async function getAllSessions(): Promise<Session[]> {
  try {
    const raw = await AsyncStorage.getItem(SESSIONS_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Session[];
  } catch (error) {
    return [];
  }
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
