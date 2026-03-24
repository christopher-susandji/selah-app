import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FAF8F5" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ gestureEnabled: false, headerShown: false }}
      />
      <Stack.Screen name="focus-setup" />
      <Stack.Screen name="session" options={{ gestureEnabled: false }} />
      <Stack.Screen name="finish" />
      <Stack.Screen name="history" />
    </Stack>
  );
}
