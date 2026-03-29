import ErrorBoundary from "@/components/ErrorBoundary";
import { Colors } from "@/constants/colors";
import { getReminderSettings } from "@/storage/notifications";
import { hasCompletedOnboarding } from "@/storage/onboarding";
import { scheduleReminder } from "@/storage/reminder";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import {
  Newsreader_300Light,
  Newsreader_400Regular,
  Newsreader_400Regular_Italic,
} from "@expo-google-fonts/newsreader";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Newsreader_300Light,
    Newsreader_400Regular,
    Newsreader_400Regular_Italic,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    DMSerifDisplay_400Regular,
  });
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    async function checkOnboarding() {
      const completed = await hasCompletedOnboarding();
      setShowOnboarding(!completed);
      setOnboardingChecked(true);
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    async function rescheduleIfEnabled() {
      const settings = await getReminderSettings();
      if (settings.enabled) {
        await scheduleReminder(settings);
      }
    }
    rescheduleIfEnabled();
  }, []);

  useEffect(() => {
    if (!fontsLoaded || !onboardingChecked) return;

    SplashScreen.hideAsync();
    if (showOnboarding) {
      router.replace("/onboarding");
    }
  }, [fontsLoaded, onboardingChecked]);

  if (!fontsLoaded || !onboardingChecked) return null;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <ErrorBoundary>
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
        <Stack.Screen
          name="onboarding"
          options={{ gestureEnabled: false, headerShown: false }}
        />
        <Stack.Screen name="focus-setup" />
        <Stack.Screen name="session" options={{ gestureEnabled: false }} />
        <Stack.Screen name="finish" />
        <Stack.Screen name="history" />
        <Stack.Screen name="settings" />
      </ErrorBoundary>
    </Stack>
  );
}
