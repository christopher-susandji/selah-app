import Timer from "@/components/Timer";
import { render } from "@testing-library/react-native";

describe("Timer", () => {
  it("formats elapsed seconds as mm:ss", () => {
    const { getByText, rerender } = render(
      <Timer elapsedSec={0} isRunning={false} />,
    );

    expect(getByText("00:00")).toBeTruthy();

    rerender(<Timer elapsedSec={65} isRunning={true} />);
    expect(getByText("01:05")).toBeTruthy();
  });
});
