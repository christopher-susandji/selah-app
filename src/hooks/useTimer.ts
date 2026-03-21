import { useCallback, useEffect, useRef, useState } from "react";

interface UseTimerReturn {
  elapsedSec: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

export function useTimer(): UseTimerReturn {
  // – States
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // – Refs
  // stores when the timer was last started/resumed, using Date.now() timestamp in ms
  const startedAtRef = useRef<number | null>(null);
  // stores the accumulated seconds before last pause
  const accumulatedRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // – Helpers
  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();

    intervalRef.current = setInterval(() => {
      if (startedAtRef.current === null) return;
      const secondsSinceStart = (Date.now() - startedAtRef.current) / 1000;
      const total = accumulatedRef.current + secondsSinceStart;
      setElapsedSec(Math.floor(total));
    }, 250);
  }, [stopInterval]);

  // – Public API
  const start = useCallback(() => {
    accumulatedRef.current = 0;
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (!isRunning || startedAtRef.current === null) return;
    const secondsSinceStart = (Date.now() - startedAtRef.current) / 1000;
    const frozenWholeSeconds = Math.floor(
      accumulatedRef.current + secondsSinceStart,
    );
    accumulatedRef.current = frozenWholeSeconds;
    startedAtRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const resume = useCallback(() => {
    if (isRunning) return;
    startedAtRef.current = Date.now();
    setIsRunning(true);
  }, [isRunning]);

  const reset = useCallback(() => {
    stopInterval();
    accumulatedRef.current = 0;
    startedAtRef.current = null;
    setElapsedSec(0);
    setIsRunning(false);
  }, [stopInterval]);

  // – Effect: manage interval based on isRunning
  useEffect(() => {
    if (isRunning) {
      startInterval();
    } else {
      stopInterval();
    }

    // cleanup on unmount, avoids memory leaks
    return () => stopInterval();
  }, [isRunning, startInterval, stopInterval]);

  return { elapsedSec, isRunning, start, pause, resume, reset };
}
