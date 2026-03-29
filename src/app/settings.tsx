import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import { useReminder } from "@/hooks/useReminder";
import { clearAllData } from "@/storage/clearData";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Constants from "expo-constants";
import { router } from "expo-router";
import Stack, {
    ExtendedStackNavigationOptions,
} from "expo-router/build/layouts/StackClient";
import { useMemo } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { settings, isLoading, updateSettings } = useReminder();

  // – Handlers
  const pickerDate = useMemo(() => {
    const d = new Date();
    d.setHours(settings.hour, settings.minute, 0, 0);
    return d;
  }, [settings.hour, settings.minute]);

  function handleTimeChange(event: DateTimePickerEvent, date?: Date) {
    if (event.type === "dismissed" || !date) return;
    updateSettings({
      ...settings,
      hour: date.getHours(),
      minute: date.getMinutes(),
    });
  }

  function handleReminderToggle(value: boolean) {
    updateSettings({ ...settings, enabled: value });
  }

  function handleHourChange(direction: "up" | "down") {
    const next = (settings.hour + (direction === "up" ? 1 : -1) + 24) % 24;
    updateSettings({ ...settings, hour: next });
  }

  function handleMinuteChange(direction: "up" | "down") {
    const next = (settings.minute + (direction === "up" ? 5 : -5) + 60) % 60;
    updateSettings({ ...settings, minute: next });
  }

  function handleClearData() {
    Alert.alert(
      "Clear All Data",
      "This will delete all your sessions, streaks, and settings. This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              router.replace("/");
            } catch {
              Alert.alert("Something went wrong", "Please try again.");
            }
          },
        },
      ],
    );
  }

  const version = Constants.expoConfig?.version ?? "1.0.0";

  // – Render
  return (
    <SafeAreaProvider style={styles.safe}>
      <Stack.Screen options={screenOptions} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Section: Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          {/* Reminder toggle row */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Daily Reminder</Text>
              <Text style={styles.rowHint}>
                Choose your preferred time to receive a daily reminder.
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleReminderToggle}
              disabled={isLoading}
              trackColor={{
                false: Colors.surfaceContainerHigh,
                true: Colors.primary,
              }}
              thumbColor={Colors.onPrimary}
            />
          </View>
          {/* Time picker row */}
          {settings.enabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.timePickerRow}>
                <Text style={styles.rowLabel}>Reminder time</Text>
                <DateTimePicker
                  mode="time"
                  value={pickerDate}
                  is24Hour={false}
                  display="default" // "spinner" on iOS shows the wheel inline
                  onChange={handleTimeChange}
                  themeVariant="light" // matches app background — no dark mode inversion
                  accentColor={Colors.primary}
                />
              </View>
            </>
          )}
        </View>

        {/* Section: Data */}
        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.card}>
          <Pressable
            onPress={handleClearData}
            android_ripple={{ color: "#FAF8F5" }}
          >
            {({ pressed }) => (
              <View style={[styles.row, pressed && styles.pressed]}>
                <Text style={styles.destructiveLabel}>Clear All Data</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Footer: app version */}
        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>{version}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const screenOptions: ExtendedStackNavigationOptions = {
  headerShown: true,
  title: "Settings",
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: Colors.primary,
  headerTitleStyle: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 20,
    fontWeight: "normal",
    color: Colors.textPrimary,
  },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Colors.background },
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: Spacing.gutter,
    paddingBottom: Spacing[10],
  },
  header: {
    marginTop: Spacing[10],
    marginBottom: Spacing[8],
  },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
  },
  sectionLabel: {
    ...Type.labelSm,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
    marginTop: Spacing[6],
  },
  card: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[4],
    minHeight: 56,
  },
  rowText: { flex: 1, paddingRight: Spacing[4] },
  rowLabel: { ...Type.bodyMd, color: Colors.textPrimary },
  rowHint: { ...Type.bodySm, marginTop: 2 },
  rowValue: { ...Type.bodyMd, color: Colors.textSecondary },
  divider: {
    height: 1,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: Spacing[5],
  },
  destructiveLabel: {
    ...Type.bodyMd,
    color: Colors.error,
  },
  pressed: { opacity: 0.6 },
  timePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2], // less padding — picker itself has internal height
    minHeight: 56,
  },
});
