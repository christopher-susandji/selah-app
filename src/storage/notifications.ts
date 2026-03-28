import AsyncStorage from "@react-native-async-storage/async-storage";

const REMINDER_KEY = "@selah/reminder";

export interface ReminderSettings {
  enabled: boolean;
  hour: number;
  minute: number;
}

const DEFAULT_SETTINGS: ReminderSettings = {
  enabled: false,
  hour: 8,
  minute: 0,
};

export async function getReminderSettings(): Promise<ReminderSettings> {
  const raw = await AsyncStorage.getItem(REMINDER_KEY);
  if (!raw) return DEFAULT_SETTINGS;

  try {
    return JSON.parse(raw) as ReminderSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveReminderSettings(
  settings: ReminderSettings,
): Promise<void> {
  await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
}
