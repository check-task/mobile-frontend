import type { SvgProps } from "react-native-svg";

/**
 * 아이콘 크기 variant.
 * Figma 아이콘 컴포넌트의 원본 크기는 24px이며, `md`(20px)가 기본값이다.
 * `xs`(12px)는 Figma `(mobile) 폴더필터링`처럼 caption(10px) 옆에 붙는 아이콘용이다.
 */
export const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconVariant = keyof typeof ICON_SIZES;

export type IconProps = Omit<SvgProps, "width" | "height" | "viewBox"> & {
  /** 아이콘 크기 variant (기본값: `md` = 20px) */
  variant?: IconVariant;
  /**
   * 아이콘 색상. semantic token 클래스(`className="text-gray-600"`)를 우선 사용하고,
   * JS 값으로 넘겨야 하는 경우에만 이 prop을 쓴다.
   */
  color?: string;
};
