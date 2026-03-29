import AsyncStorage from "@react-native-async-storage/async-storage";
import { cancelReminder } from "./reminder";

const ALL_KEYS = [
  "selah:sessions",
  "selah:streak",
  "@selah/onboarding_complete",
  "@selah/reminder",
];

export async function clearAllData(): Promise<void> {
  await cancelReminder();
  await AsyncStorage.multiRemove(ALL_KEYS);
}
