import * as Notifications from "expo-notifications";
import { ReminderSettings } from "./notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync(); // will check current permission
  if (existing === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync(); // will show system dialog
  return status === "granted";
}

export async function scheduleReminder(
  settings: ReminderSettings,
): Promise<void> {
  await cancelReminder(); // avoid duplicates

  if (!settings.enabled) return;
  const granted = await requestNotificationPermissions();
  if (!granted) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to read the Bible.",
      body: "Your daily Scripture session is waiting.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: settings.hour,
      minute: settings.minute,
    },
  });
}

export async function cancelReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
