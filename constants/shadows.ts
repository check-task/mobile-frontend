import type { ViewStyle } from "react-native";

export const CARD_SHADOW = {
  shadowColor: "#090A0B",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
} satisfies ViewStyle;

export const SNACKBAR_SHADOW = {
  shadowColor: "#090A0B",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.16,
  shadowRadius: 4,
  elevation: 3,
} satisfies ViewStyle;

export const DROPDOWN_SHADOW = {
  shadowColor: "#D3D6D9",
  shadowOffset: { width: -4, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 100,
  elevation: 4,
} satisfies ViewStyle;

// 팀 과제 상세의 세부 TASK 카드처럼 일반 카드보다 진한 그림자(0,1,.16,4, 검정).
export const STRONG_CARD_SHADOW = {
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.16,
  shadowRadius: 4,
  elevation: 3,
} satisfies ViewStyle;

export const FAB_PRIMARY_SHADOW = {
  shadowColor: "#317AE4",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.24,
  shadowRadius: 16,
  elevation: 8,
} satisfies ViewStyle;

export const FAB_SECONDARY_SHADOW = {
  shadowColor: "#090A0B",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 16,
  elevation: 8,
} satisfies ViewStyle;
