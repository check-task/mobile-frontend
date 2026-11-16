import { useSyncExternalStore } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";

import { useThemeStore } from "@/store/themeStore";

const subscribe = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  // 서버(정적 렌더링)와 hydration 중에는 false, 클라이언트에서는 true
  const hasHydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const systemScheme = useRNColorScheme();
  const preference = useThemeStore((state) => state.preference);

  if (hasHydrated) {
    return preference === "system" ? systemScheme : preference;
  }

  return "light";
}
