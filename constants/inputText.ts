import type { TextStyle } from "react-native";

/**
 * 입력값(`TextInput`)용 글자 스타일. `text-*` 토큰에서 줄높이만 뺀 값이다.
 * `TextInput`에 줄높이를 주면 한글/영문에 따라 글자 높이가 달라져 입력 중 들썩이므로
 * 토큰 대신 이 값을 `style`로 넘긴다. 크기·자간은 tailwind.config.js 의 TEXT_STYLES 와 맞춘다.
 * 입력칸과 한 줄에 붙어 높이를 맞춰야 하는 글자(예: 데이트피커 시간 칩의 오전/오후, `:`)에도 쓴다.
 */
export const INPUT_TEXT = {
  "b-02-r": {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    letterSpacing: -0.28,
  },
  "b-03-r": {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    letterSpacing: -0.26,
  },
  "b-04-r": {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    letterSpacing: -0.24,
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    letterSpacing: -0.2,
  },
} as const satisfies Record<string, TextStyle>;
