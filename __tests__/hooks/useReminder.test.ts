import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useReminder } from "@/hooks/useReminder";
import { getReminderSettings, saveReminderSettings } from "@/storage/notifications";
import { scheduleReminder } from "@/storage/reminder";

jest.mock("@/storage/notifications", () => ({
  getReminderSettings: jest.fn(),
  saveReminderSettings: jest.fn(),
}));

jest.mock("@/storage/reminder", () => ({
  scheduleReminder: jest.fn(),
}));

const getReminderSettingsMock = getReminderSettings as jest.MockedFunction<typeof getReminderSettings>;
const saveReminderSettingsMock = saveReminderSettings as jest.MockedFunction<typeof saveReminderSettings>;
const scheduleReminderMock = scheduleReminder as jest.MockedFunction<typeof scheduleReminder>;

describe("useReminder", () => {
  beforeEach(() => {
    getReminderSettingsMock.mockReset();
    saveReminderSettingsMock.mockReset();
    scheduleReminderMock.mockReset();
  });

  it("loads stored settings", async () => {
    getReminderSettingsMock.mockResolvedValue({
      enabled: true,
      hour: 7,
      minute: 30,
    });

    const { result } = renderHook(() => useReminder());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.settings).toEqual({
      enabled: true,
      hour: 7,
      minute: 30,
    });
  });

  it("updates settings and schedules reminder", async () => {
    getReminderSettingsMock.mockResolvedValue({
      enabled: false,
      hour: 8,
      minute: 0,
    });
    saveReminderSettingsMock.mockResolvedValue();
    scheduleReminderMock.mockResolvedValue();

    const { result } = renderHook(() => useReminder());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const nextSettings = {
      enabled: true,
      hour: 6,
      minute: 45,
    };

    await act(async () => {
      await result.current.updateSettings(nextSettings);
    });

    expect(result.current.settings).toEqual(nextSettings);
    expect(saveReminderSettingsMock).toHaveBeenCalledWith(nextSettings);
    expect(scheduleReminderMock).toHaveBeenCalledWith(nextSettings);
  });
});
