import { useThemeStore } from "@/store/themeStore";

export type { ThemePreference } from "@/store/themeStore";

/** 설정 화면의 테마 선택(라이트/다크/시스템). 앱을 다시 켜도 유지된다 */
export function useThemePreference() {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  return { preference, setPreference };
}
