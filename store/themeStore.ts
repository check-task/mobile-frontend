import { getItemAsync, setItemAsync } from "expo-secure-store";
import { create } from "zustand";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme-preference";

const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

type ThemeStore = {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  preference: "system",
  setPreference: (preference) => {
    set({ preference });
    // 저장 실패(웹 등 secure-store 미지원)해도 이번 실행 동안은 적용된다
    setItemAsync(STORAGE_KEY, preference).catch(() => {});
  },
}));

// 앱 시작 시 한 번 저장된 선택을 불러온다
getItemAsync(STORAGE_KEY)
  .then((saved) => {
    if (isThemePreference(saved)) useThemeStore.setState({ preference: saved });
  })
  .catch(() => {});
