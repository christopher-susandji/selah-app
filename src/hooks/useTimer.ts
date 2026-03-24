import { useCallback, useRef, useState } from "react";

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
  const startTicking = useCallback(() => {
    if (intervalRef.current) return; // already ticking

    intervalRef.current = setInterval(() => {
      if (startedAtRef.current === null) return;
      const segmentMs = Date.now() - startedAtRef.current;
      const total = accumulatedRef.current + segmentMs;
      setElapsedSec(Math.floor(total / 1000));
    }, 250);
  }, []);

  const stopTicking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // – Public API
  const start = useCallback(() => {
    accumulatedRef.current = 0;
    startedAtRef.current = Date.now();
    setElapsedSec(0);
    setIsRunning(true);
    startTicking();
  }, [startTicking]);

  const pause = useCallback(() => {
    if (startedAtRef.current === null) return;

    accumulatedRef.current += Date.now() - startedAtRef.current;
    startedAtRef.current = null;
    setIsRunning(false);
    stopTicking();
  }, [stopTicking]);

  const resume = useCallback(() => {
    if (startedAtRef.current !== null) return;

    // New segment
    startedAtRef.current = Date.now();
    setIsRunning(true);
    startTicking();
  }, [startTicking]);

  const reset = useCallback(() => {
    stopTicking();
    accumulatedRef.current = 0;
    startedAtRef.current = null;
    setElapsedSec(0);
    setIsRunning(false);
  }, [stopTicking]);

  //   // – Effect: manage interval based on isRunning
  //   useEffect(() => {
  //     if (isRunning) {
  //       startTicking();
  //     } else {
  //       stopTicking();
  //     }

  //     // cleanup on unmount, avoids memory leaks
  //     return () => stopTicking();
  //   }, [isRunning, startTicking, stopTicking]);

  return { elapsedSec, isRunning, start, pause, resume, reset };
}
