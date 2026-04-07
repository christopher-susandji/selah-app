import FocusSetupChecklist from "@/components/FocusSetupChecklist";
import { fireEvent, render } from "@testing-library/react-native";

describe("FocusSetupChecklist", () => {
  it("renders setup rows", () => {
    const { getByText } = render(<FocusSetupChecklist />);

    expect(getByText("Enable Do Not Disturb")).toBeTruthy();
    expect(getByText("Place Phone Face Down")).toBeTruthy();
  });

  it("toggles a checklist item", () => {
    const { getByText, queryAllByText } = render(<FocusSetupChecklist />);

    expect(queryAllByText("✓")).toHaveLength(0);

    fireEvent.press(getByText("Enable Do Not Disturb"));
    expect(queryAllByText("✓")).toHaveLength(1);

    fireEvent.press(getByText("Enable Do Not Disturb"));
    expect(queryAllByText("✓")).toHaveLength(0);
  });
});
