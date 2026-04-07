import ErrorBoundary from "@/components/ErrorBoundary";
import { fireEvent, render } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Text } from "react-native";

describe("ErrorBoundary", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders fallback UI when child throws", () => {
    function ThrowingChild(): ReactNode {
      throw new Error("Boom");
    }

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>,
    );

    expect(getByText("Something went wrong.")).toBeTruthy();
    expect(getByText("Try Again")).toBeTruthy();
  });

  it("resets and retries children", () => {
    function AlwaysThrow(): ReactNode {
      throw new Error("Boom");
    }

    const { getByText, rerender } = render(
      <ErrorBoundary>
        <AlwaysThrow />
      </ErrorBoundary>,
    );

    expect(getByText("Something went wrong.")).toBeTruthy();

    rerender(
      <ErrorBoundary>
        <Text>Recovered child</Text>
      </ErrorBoundary>,
    );

    fireEvent.press(getByText("Try Again"));
    expect(getByText("Recovered child")).toBeTruthy();
  });
});
