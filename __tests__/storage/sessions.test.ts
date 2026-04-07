import {
    clearSessionInProgress,
    getAllSessions,
    getInterruptedSession,
    getSessionsByDate,
    markSessionInProgress,
    saveSession,
    syncExistingSessions,
} from "@/storage/sessions";
import type { Session } from "@/types/session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mockGetSession = jest.fn();

jest.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

const mockSyncSession = jest.fn();
const mockSyncAllSessions = jest.fn();

jest.mock("@/storage/sync", () => ({
  syncSession: (...args: unknown[]) => mockSyncSession(...args),
  syncAllSessions: (...args: unknown[]) => mockSyncAllSessions(...args),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

const sampleSession: Session = {
  id: "s1",
  startAt: "2026-04-07T08:00:00.000Z",
  endAt: "2026-04-07T08:10:00.000Z",
  elapsedSec: 600,
  distractionTaps: 2,
  leaveAppCount: 1,
  reflection: "note",
};

describe("storage/sessions", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockRemoveItem.mockReset();
    mockGetSession.mockReset();
    mockSyncSession.mockReset();
    mockSyncAllSessions.mockReset();
  });

  it("returns empty array when sessions key is missing", async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(getAllSessions()).resolves.toEqual([]);
  });

  it("returns empty array for invalid session payload", async () => {
    mockGetItem.mockResolvedValue("{}");

    await expect(getAllSessions()).resolves.toEqual([]);
  });

  it("saves new session at the beginning of list", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify([{ ...sampleSession, id: "older" }]),
    );
    mockSetItem.mockResolvedValue(undefined);
    mockGetSession.mockResolvedValue({ data: { session: null } });

    await saveSession(sampleSession);

    expect(mockSetItem).toHaveBeenCalledWith(
      "selah:sessions",
      JSON.stringify([sampleSession, { ...sampleSession, id: "older" }]),
    );
  });

  it("syncs saved session when authenticated user exists", async () => {
    mockGetItem.mockResolvedValue(JSON.stringify([]));
    mockSetItem.mockResolvedValue(undefined);
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
    });
    mockSyncSession.mockResolvedValue(undefined);

    await saveSession(sampleSession);
    await Promise.resolve();

    expect(mockSyncSession).toHaveBeenCalledWith(sampleSession, "u1");
  });

  it("filters sessions by date", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify([
        sampleSession,
        { ...sampleSession, id: "s2", startAt: "2026-04-06T01:00:00.000Z" },
      ]),
    );

    await expect(getSessionsByDate("2026-04-07")).resolves.toEqual([
      sampleSession,
    ]);
  });

  it("manages interrupted session key", async () => {
    mockSetItem.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);
    mockGetItem.mockResolvedValue("2026-04-07T08:00:00.000Z");

    await markSessionInProgress("2026-04-07T08:00:00.000Z");
    await clearSessionInProgress();
    const interrupted = await getInterruptedSession();

    expect(mockSetItem).toHaveBeenCalledWith(
      "selah:inProgress",
      "2026-04-07T08:00:00.000Z",
    );
    expect(mockRemoveItem).toHaveBeenCalledWith("selah:inProgress");
    expect(interrupted).toBe("2026-04-07T08:00:00.000Z");
  });

  it("syncExistingSessions uploads local sessions for signed-in user", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "u1" } } },
    });
    mockGetItem.mockResolvedValue(JSON.stringify([sampleSession]));
    mockSyncAllSessions.mockResolvedValue(undefined);

    await syncExistingSessions();

    expect(mockSyncAllSessions).toHaveBeenCalledWith([sampleSession], "u1");
  });
});
