import { useCallback, useEffect, useState } from "react";

export function useCountdown(totalSeconds: number) {
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) return;

    const timer = setTimeout(() => {
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [remainingSeconds]);

  const restart = useCallback(() => {
    setRemainingSeconds(totalSeconds);
  }, [totalSeconds]);

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return {
    remainingSeconds,
    label: `${minutes}:${seconds}`,
    isExpired: remainingSeconds <= 0,
    restart,
  };
}
