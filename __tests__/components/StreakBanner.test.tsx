import StreakBanner from "@/components/StreakBanner";
import { render } from "@testing-library/react-native";

describe("StreakBanner", () => {
  it("uses the default label", () => {
    const { getByText } = render(<StreakBanner />);

    expect(getByText("Daily rhythm")).toBeTruthy();
    expect(getByText("Begin today")).toBeTruthy();
  });

  it("renders streak labels", () => {
    const { getByText, rerender } = render(<StreakBanner days={1} />);

    expect(getByText("1 day")).toBeTruthy();

    rerender(<StreakBanner days={4} />);
    expect(getByText("4 days")).toBeTruthy();
  });

  it("prioritizes reset messaging", () => {
    const { getByText } = render(<StreakBanner days={8} wasReset />);

    expect(getByText("Today is a good day to begin again.")).toBeTruthy();
  });
});
