import {
    getReminderSettings,
    saveReminderSettings,
} from "@/storage/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("storage/notifications", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
  });

  it("returns defaults when no settings are stored", async () => {
    mockGetItem.mockResolvedValue(null);

    await expect(getReminderSettings()).resolves.toEqual({
      enabled: false,
      hour: 8,
      minute: 0,
    });
  });

  it("returns defaults when stored data is invalid JSON", async () => {
    mockGetItem.mockResolvedValue("not-json");

    await expect(getReminderSettings()).resolves.toEqual({
      enabled: false,
      hour: 8,
      minute: 0,
    });
  });

  it("returns parsed settings when valid JSON exists", async () => {
    mockGetItem.mockResolvedValue(
      JSON.stringify({ enabled: true, hour: 6, minute: 30 }),
    );

    await expect(getReminderSettings()).resolves.toEqual({
      enabled: true,
      hour: 6,
      minute: 30,
    });
  });

  it("persists reminder settings", async () => {
    const settings = { enabled: true, hour: 7, minute: 15 };

    await saveReminderSettings(settings);

    expect(mockSetItem).toHaveBeenCalledWith(
      "@selah/reminder",
      JSON.stringify(settings),
    );
  });
});
