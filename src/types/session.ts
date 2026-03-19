export interface Session {
  id: string; // uuid
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  elapsedSec: number; // total elapsed seconds (includes time away)
  distractionTaps: number;
  leaveAppCount: number;
  reflection: string | null;
}

export interface StreakInfo {
  currentStreakDays: number;
  lastSessionDate: string; // YYYY-MM-DD local
  longestStreakDays: number;
}
