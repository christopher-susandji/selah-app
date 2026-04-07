import { renderHook } from "@testing-library/react-native";
import { useConditionalKeepAwake } from "@/hooks/useKeepAwake";
import { useKeepAwake } from "expo-keep-awake";

jest.mock("expo-keep-awake", () => ({
  useKeepAwake: jest.fn(),
}));

describe("useConditionalKeepAwake", () => {
  it("passes a tag only when active", () => {
    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) => useConditionalKeepAwake(isActive),
      { initialProps: { isActive: true } },
    );

    expect(useKeepAwake).toHaveBeenCalledWith("session");

    rerender({ isActive: false });

    expect(useKeepAwake).toHaveBeenLastCalledWith(undefined);
  });
});
