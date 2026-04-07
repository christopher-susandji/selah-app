import { act, renderHook } from "@testing-library/react-native";
import { useAppState } from "@/hooks/useAppState";
import { AppState } from "react-native";

const mockRemove = jest.fn();
let mockAppStateListener: ((nextState: "active" | "inactive" | "background") => void) | undefined;

let addEventListenerSpy: jest.SpiedFunction<typeof AppState.addEventListener>;

describe("useAppState", () => {
  beforeEach(() => {
    mockRemove.mockClear();
    mockAppStateListener = undefined;

    Object.defineProperty(AppState, "currentState", {
      configurable: true,
      value: "active",
    });

    addEventListenerSpy = jest
      .spyOn(AppState, "addEventListener")
      .mockImplementation((_, listener) => {
        mockAppStateListener = listener as (
          nextState: "active" | "inactive" | "background"
        ) => void;

        return {
          remove: mockRemove,
        } as any;
      });
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
  });

  it("tracks app state transitions and leave count", () => {
    const { result } = renderHook(() => useAppState());

    expect(result.current.appState).toBe("active");
    expect(result.current.leaveCount).toBe(0);

    act(() => {
      mockAppStateListener?.("background");
    });

    expect(result.current.appState).toBe("background");
    expect(result.current.leaveCount).toBe(1);

    act(() => {
      mockAppStateListener?.("active");
      mockAppStateListener?.("inactive");
    });

    expect(result.current.appState).toBe("inactive");
    expect(result.current.leaveCount).toBe(2);

    act(() => {
      result.current.resetLeaveCount();
    });

    expect(result.current.leaveCount).toBe(0);
  });

  it("removes app state listener on unmount", () => {
    const { unmount } = renderHook(() => useAppState());

    unmount();

    expect(mockRemove).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });
});
