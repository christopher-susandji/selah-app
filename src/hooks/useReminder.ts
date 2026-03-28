import {
    getReminderSettings,
    ReminderSettings,
    saveReminderSettings,
} from "@/storage/notifications";
import { scheduleReminder } from "@/storage/reminder";
import { useEffect, useState } from "react";

export function useReminder() {
  const [settings, setSettings] = useState<ReminderSettings>({
    enabled: false,
    hour: 8,
    minute: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getReminderSettings().then((s) => {
      setSettings(s);
      setIsLoading(false);
    });
  }, []);

  const updateSettings = async (newSettings: ReminderSettings) => {
    setSettings(newSettings); // optimistic update
    await saveReminderSettings(newSettings);
    await scheduleReminder(newSettings);
  };

  return { settings, isLoading, updateSettings };
}
