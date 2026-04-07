import { act, renderHook } from "@testing-library/react-native";
import { useTimer } from "@/hooks/useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("starts, pauses, resumes, and resets", () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.elapsedSec).toBe(0);
    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1100);
    });

    expect(result.current.elapsedSec).toBeGreaterThanOrEqual(1);

    act(() => {
      result.current.pause();
    });

    const pausedAt = result.current.elapsedSec;
    expect(result.current.isRunning).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(result.current.elapsedSec).toBe(pausedAt);

    act(() => {
      result.current.resume();
      jest.advanceTimersByTime(1100);
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.elapsedSec).toBeGreaterThan(pausedAt);

    act(() => {
      result.current.reset();
    });

    expect(result.current.elapsedSec).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});
