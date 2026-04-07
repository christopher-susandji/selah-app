jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

import { supabase } from "@/lib/supabase";
import { syncAllSessions, syncSession } from "@/storage/sync";
import type { Session } from "@/types/session";

describe("storage/sync", () => {
  const sampleSession: Session = {
    id: "s1",
    startAt: "2026-04-07T08:00:00.000Z",
    endAt: "2026-04-07T08:10:00.000Z",
    elapsedSec: 600,
    distractionTaps: 1,
    leaveAppCount: 0,
    reflection: null,
  };

  const mockFrom = supabase.from as jest.Mock;
  const mockUpsert = jest.fn();

  beforeEach(() => {
    mockFrom.mockReset();
    mockUpsert.mockReset();
    mockFrom.mockReturnValue({ upsert: mockUpsert });
  });

  it("syncs a single session row", async () => {
    mockUpsert.mockResolvedValue({ error: null });

    await expect(syncSession(sampleSession, "user-1")).resolves.toBeUndefined();

    expect(mockFrom).toHaveBeenCalledWith("sessions");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ id: "s1", user_id: "user-1" }),
      { onConflict: "id" },
    );
  });

  it("throws when syncing a single session fails", async () => {
    mockUpsert.mockResolvedValue({ error: { message: "boom" } });

    await expect(syncSession(sampleSession, "user-1")).rejects.toThrow(
      "Failed to sync session: boom",
    );
  });

  it("returns early when syncAllSessions receives an empty list", async () => {
    await syncAllSessions([], "user-1");

    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("syncs all sessions for a user", async () => {
    mockUpsert.mockResolvedValue({ error: null });

    await syncAllSessions([sampleSession], "user-1");

    expect(mockFrom).toHaveBeenCalledWith("sessions");
    expect(mockUpsert).toHaveBeenCalledWith(
      [expect.objectContaining({ id: "s1", user_id: "user-1" })],
      { onConflict: "id" },
    );
  });
});
