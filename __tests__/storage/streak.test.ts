import { getStreakInfo, updateStreak } from "@/storage/streak";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("storage/streak", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
  });

  it("returns default streak for missing data", async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(getStreakInfo()).resolves.toEqual({
      currentStreakDays: 0,
      lastSessionDate: "",
      longestStreakDays: 0,
    });
  });

  it("does not update if session already exists for today", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({
        currentStreakDays: 4,
        lastSessionDate: "2026-04-07",
        longestStreakDays: 7,
      }),
    );

    await expect(updateStreak("2026-04-07")).resolves.toEqual({
      currentStreakDays: 4,
      lastSessionDate: "2026-04-07",
      longestStreakDays: 7,
    });
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  it("increments streak when previous session was yesterday", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({
        currentStreakDays: 2,
        lastSessionDate: "2026-04-06",
        longestStreakDays: 2,
      }),
    );

    const result = await updateStreak("2026-04-07");

    expect(result).toEqual({
      currentStreakDays: 3,
      lastSessionDate: "2026-04-07",
      longestStreakDays: 3,
    });
    expect(mockSetItem).toHaveBeenCalled();
  });
});
