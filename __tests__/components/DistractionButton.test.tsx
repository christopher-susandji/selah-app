import { fireEvent, render } from "@testing-library/react-native";
import * as Haptics from "expo-haptics";
import DistractionButton from "../../src/components/DistractionButton";

jest.mock("expo-haptics", () => ({
  NotificationFeedbackType: { Warning: "warning" },
  notificationAsync: jest.fn(),
}));

describe("DistractionButton", () => {
  it("calls haptics and onPress when tapped", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <DistractionButton count={0} onPress={onPress} />,
    );

    fireEvent.press(getByText("I got distracted"));

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(
      Haptics.NotificationFeedbackType.Warning,
    );
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows singular and plural distraction copy", () => {
    const { queryByText, rerender, getByText } = render(
      <DistractionButton count={0} onPress={jest.fn()} />,
    );

    expect(queryByText(/this session/)).toBeNull();

    rerender(<DistractionButton count={1} onPress={jest.fn()} />);
    expect(getByText("1 time this session")).toBeTruthy();

    rerender(<DistractionButton count={2} onPress={jest.fn()} />);
    expect(getByText("2 times this session")).toBeTruthy();
  });
});
