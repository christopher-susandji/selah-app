import { clearAllData } from "@/storage/clearData";
import AsyncStorage from "@react-native-async-storage/async-storage";

const mockCancelReminder = jest.fn();

jest.mock("@/storage/reminder", () => ({
  cancelReminder: (...args: unknown[]) => mockCancelReminder(...args),
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  multiRemove: jest.fn(),
}));

const mockMultiRemove = AsyncStorage.multiRemove as jest.Mock;

describe("storage/clearData", () => {
  beforeEach(() => {
    mockCancelReminder.mockReset();
    mockMultiRemove.mockReset();
    mockCancelReminder.mockResolvedValue(undefined);
    mockMultiRemove.mockResolvedValue(undefined);
  });

  it("cancels reminders and removes all app keys", async () => {
    await clearAllData();

    expect(mockCancelReminder).toHaveBeenCalledTimes(1);
    expect(mockMultiRemove).toHaveBeenCalledWith([
      "selah:sessions",
      "selah:streak",
      "@selah/onboarding_complete",
      "@selah/reminder",
    ]);
  });
});
