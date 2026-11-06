import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";

const TICK_MS = 1000;

function getRemainingSeconds(expiresAt: number) {
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
}

//만료 시각을 기준으로 남은 시간을 계산해 백그라운드에 있던 시간도 반영
export function useCountdown(totalSeconds: number) {
  const [expiresAt, setExpiresAt] = useState(
    () => Date.now() + totalSeconds * 1000
  );
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);

  useEffect(() => {
    const update = () => setRemainingSeconds(getRemainingSeconds(expiresAt));
    update();

    const timer = setInterval(update, TICK_MS);
    //앱으로 돌아오면 다음을 기다리지 않고 바로 갱신
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [expiresAt]);

  const restart = useCallback(() => {
    setExpiresAt(Date.now() + totalSeconds * 1000);
  }, [totalSeconds]);

  const checkExpired = useCallback(
    () => getRemainingSeconds(expiresAt) <= 0,
    [expiresAt]
  );

  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");

  return {
    remainingSeconds,
    label: `${minutes}:${seconds}`,
    isExpired: remainingSeconds <= 0,
    //렌더 시점이 아닌 지금 기준으로 만료 여부를 확인
    checkExpired,
    restart,
  };
}
