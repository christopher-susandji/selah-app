import { supabase } from "@/lib/supabase";
import { Session } from "@/types/session";

// Maps Session to Supabase column format.
function toRow(session: Session, userId: string) {
  return {
    id: session.id,
    user_id: userId,
    started_at: session.startAt,
    ended_at: session.endAt,
    duration_sec: session.elapsedSec,
    distractions: session.distractionTaps,
    left_app: session.leaveAppCount,
    reflection: session.reflection ?? null,
    synced_at: new Date().toISOString(),
  };
}

// Upload single session. Called after saveSession()
export async function syncSession(
  session: Session,
  userId: string,
): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .upsert(toRow(session, userId), { onConflict: "id" });
  if (error) throw new Error(`Failed to sync session: ${error.message}`);
}

// Upload all local sessions to Supabase, called when user signs in for the first time.
export async function syncAllSessions(
  sessions: Session[],
  userId: string,
): Promise<void> {
  if (sessions.length === 0) return;
  const rows = sessions.map((session) => toRow(session, userId));
  const { error } = await supabase
    .from("sessions")
    .upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`Failed to sync sessions: ${error.message}`);
}
