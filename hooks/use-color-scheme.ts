import { useColorScheme as useRNColorScheme } from "react-native";

import { useThemeStore } from "@/store/themeStore";

/** 설정 화면의 테마 선택을 반영한 색 모드. `시스템 설정`이면 기기 설정을 따른다. */
export function useColorScheme() {
  const systemScheme = useRNColorScheme();
  const preference = useThemeStore((state) => state.preference);
  return preference === "system" ? systemScheme : preference;
}
