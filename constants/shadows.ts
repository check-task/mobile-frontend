import type { ViewStyle } from "react-native";

/**
 * Figma `card` 이펙트 (drop shadow, #090A0B 8%, offset (0, 1), blur 4).
 *
 * NativeWind 4.2는 `box-shadow`를 `shadowColor` / `shadowRadius`로만 변환해
 * offset과 opacity가 유실되므로, className이 아닌 RN style 값으로 노출한다.
 * (AGENTS.md 컬러 규칙 5번 — className으로 처리할 수 없는 값은 JS 상수로 매핑)
 *
 * 그림자 색은 테마에 따라 반전되면 안 되는 고정 이펙트 토큰이므로
 * semantic color token(`gray-900`)이 아닌 고정 hex를 사용한다.
 */
export const CARD_SHADOW = {
  shadowColor: "#090A0B",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
} satisfies ViewStyle;
