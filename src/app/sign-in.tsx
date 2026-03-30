import { Colors } from "@/constants/colors";
import { Fonts, Radii, Spacing, Type } from "@/constants/theme";
import { signInWithEmail, signUpWithEmail } from "@/storage/auth";
import { Stack, router } from "expo-router";
import { ExtendedStackNavigationOptions } from "expo-router/build/layouts/StackClient";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  // – State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  // – Handlers
  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setIsLoading(true);
    try {
      if (mode === "signIn") {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
        Alert.alert(
          "Check your email",
          "A confirmation email has been sent. Please verify your email before signing in.",
        );
        setMode("signIn");
        setIsLoading(false);
        return;
      }
      router.back();
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={screenOptions} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.form}>
          <Text style={styles.heading}>
            {mode === "signIn" ? "Welcome Back" : "Create Account"}
          </Text>
          <Text style={styles.subheading}>
            {mode === "signIn"
              ? "Sign in to sync your sessions across devices."
              : "Your local data will sync automatically after signing up."}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.textPlaceholder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.textPlaceholder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={
              mode === "signUp" ? "new-password" : "current-password"
            }
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
          />
          <Pressable onPress={handleSubmit} disabled={isLoading}>
            {({ pressed }) => (
              <View
                style={[
                  styles.button,
                  (pressed || isLoading) && styles.pressed,
                ]}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.onPrimary} />
                ) : (
                  <Text style={styles.buttonText}>
                    {mode === "signIn" ? "Sign In" : "Sign Up"}
                  </Text>
                )}
              </View>
            )}
          </Pressable>

          <Pressable
            onPress={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
            style={styles.toggleRow}
          >
            {({ pressed }) => (
              <Text style={[styles.toggleText, pressed && styles.dimmed]}>
                {mode === "signIn"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Sign In"}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const screenOptions: ExtendedStackNavigationOptions = {
  headerShown: true,
  title: "",
  headerBackButtonDisplayMode: "minimal",
  headerTintColor: Colors.primary,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Colors.background },
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  form: {
    flex: 1,
    paddingHorizontal: Spacing.gutter,
    paddingTop: Spacing[8],
    gap: Spacing[4],
  },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 32,
    lineHeight: 42,
    letterSpacing: -0.3,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subheading: {
    ...Type.bodyMd,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  input: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.md,
    padding: Spacing[4],
    ...Type.bodyMd,
    lineHeight: undefined,
    color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: Radii.xl,
    alignItems: "center",
    marginTop: Spacing[2],
  },
  buttonText: { ...Type.labelLg, color: Colors.onPrimary },
  pressed: { opacity: 0.82 },
  toggleRow: { alignItems: "center", paddingVertical: Spacing[3] },
  toggleText: { ...Type.labelMd, color: Colors.onPrimaryFixedVariant },
  dimmed: { opacity: 0.55 },
});
