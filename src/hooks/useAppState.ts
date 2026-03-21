import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

interface UseAppStateReturn {
  appState: AppStateStatus;
  leaveCount: number;
  resetLeaveCount: () => void;
}

export function useAppState(): UseAppStateReturn {
  const [appState, setAppState] = useState<AppStateStatus>(
    AppState.currentState,
  );
  const [leaveCount, setLeaveCount] = useState(0);
  const previousStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          previousStateRef.current === "active" &&
          nextState.match(/inactive|background/)
        ) {
          setLeaveCount((count) => count + 1);
        }
        previousStateRef.current = nextState;
        setAppState(nextState);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const resetLeaveCount = useCallback(() => {
    setLeaveCount(0);
  }, []);

  return { appState, leaveCount, resetLeaveCount };
}
