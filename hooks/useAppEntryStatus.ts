import { useEffect, useSyncExternalStore } from "react";

import {
  getCachedTokens,
  getTokens,
  subscribeTokens,
} from "@/lib/api/tokenStorage";
import {
  getOnboardingSeen,
  loadOnboardingSeen,
  subscribeOnboardingSeen,
} from "@/lib/onboardingStorage";

// 토큰이 재발급돼 바뀌어도 로그인 여부가 같으면 다시 그리지 않게 boolean 으로 줄인다
const getIsSignedIn = () => {
  const tokens = getCachedTokens();
  return tokens === undefined ? undefined : tokens !== null;
};

/**
 * 앱 시작 화면을 고를 때 필요한 상태. 저장소를 다 읽기 전에는 isLoading 이 true 다
 * 로그인·로그아웃·재발급 실패로 토큰이 바뀌면 바로 반영된다
 */
export function useAppEntryStatus() {
  const isSignedIn = useSyncExternalStore(
    subscribeTokens,
    getIsSignedIn,
    getIsSignedIn
  );
  const hasSeenOnboarding = useSyncExternalStore(
    subscribeOnboardingSeen,
    getOnboardingSeen,
    getOnboardingSeen
  );

  useEffect(() => {
    getTokens();
    loadOnboardingSeen();
  }, []);

  return {
    isLoading: isSignedIn === undefined || hasSeenOnboarding === undefined,
    isSignedIn: isSignedIn === true,
    hasSeenOnboarding: hasSeenOnboarding === true,
  };
}
