import { Colors } from "@/constants/colors";
import { Fonts, Spacing, Type } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // called during render when a child throws
  // return new state to trigger fallback render
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // called after the error is caught, for logging
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error("[ErrorBoundary] caught:", error, info.componentStack);
  }

  handleReset = () => {
    // clears state and re-renders children
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.heading}>Something went wrong.</Text>
            <Text style={styles.body}>
              An unexpected error occurred. Please try again.
            </Text>
            <Pressable onPress={this.handleReset}>
              {({ pressed }) => (
                <View style={[styles.button, pressed && styles.pressed]}>
                  <Text style={styles.buttonText}>Try Again</Text>
                </View>
              )}
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.gutter,
    justifyContent: "center",
    gap: Spacing[5],
  },
  heading: {
    fontFamily: Fonts.newsreaderRegular,
    fontSize: 28,
    lineHeight: 38,
    color: Colors.textPrimary,
  },
  body: {
    ...Type.bodyMd,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[5],
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: { ...Type.labelLg, color: Colors.onPrimary },
  pressed: { opacity: 0.82 },
});
