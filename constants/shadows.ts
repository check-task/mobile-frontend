import type { ViewStyle } from "react-native";

export const CARD_SHADOW = {
  shadowColor: "#090A0B",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
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
