jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  SchedulableTriggerInputTypes: { DAILY: "daily" },
}));

import * as Notifications from "expo-notifications";
import {
  cancelReminder,
  requestNotificationPermissions,
  scheduleReminder,
} from "@/storage/reminder";

const mockGetPermissionsAsync = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissionsAsync = Notifications.requestPermissionsAsync as jest.Mock;
const mockScheduleNotificationAsync = Notifications.scheduleNotificationAsync as jest.Mock;
const mockCancelAll = Notifications.cancelAllScheduledNotificationsAsync as jest.Mock;

describe("storage/reminder", () => {
  beforeEach(() => {
    mockGetPermissionsAsync.mockReset();
    mockRequestPermissionsAsync.mockReset();
    mockScheduleNotificationAsync.mockReset();
    mockCancelAll.mockReset();
  });

  it("returns true when existing permission is granted", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted" });

    await expect(requestNotificationPermissions()).resolves.toBe(true);
    expect(mockRequestPermissionsAsync).not.toHaveBeenCalled();
  });

  it("requests permission when not granted", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "denied" });
    mockRequestPermissionsAsync.mockResolvedValue({ status: "granted" });

    await expect(requestNotificationPermissions()).resolves.toBe(true);
    expect(mockRequestPermissionsAsync).toHaveBeenCalled();
  });

  it("does not schedule when disabled", async () => {
    await scheduleReminder({ enabled: false, hour: 8, minute: 0 });

    expect(mockCancelAll).toHaveBeenCalledTimes(1);
    expect(mockScheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it("schedules daily reminder when enabled and granted", async () => {
    mockGetPermissionsAsync.mockResolvedValue({ status: "granted" });

    await scheduleReminder({ enabled: true, hour: 6, minute: 45 });

    expect(mockScheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        trigger: expect.objectContaining({ hour: 6, minute: 45 }),
      }),
    );
  });

  it("cancels all scheduled reminders", async () => {
    await cancelReminder();

    expect(mockCancelAll).toHaveBeenCalledTimes(1);
  });
});
