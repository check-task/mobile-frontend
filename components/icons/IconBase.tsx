import { cssInterop } from "nativewind";
import type { PropsWithChildren } from "react";
import Svg from "react-native-svg";

import { cn } from "@/lib/utils";

import { ICON_SIZES, type IconProps } from "./icon.types";

// NativeWind가 className으로 계산한 color를 react-native-svg의 `color` prop으로 전달한다.
// 각 아이콘의 path는 `currentColor`를 사용하므로 이 값이 fill/stroke에 그대로 반영된다.
cssInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { color: true },
  },
});

/**
 * 모든 아이콘이 공유하는 SVG 컨테이너.
 * Figma 아이콘 원본 크기(24px)를 viewBox로 두고, variant로 실제 렌더 크기를 결정한다.
 *
 * 색상은 `className`의 semantic token(`text-gray-600` 등)으로 지정하는 것을 기본으로 하고,
 * JS 값이 필요한 경우에만 `color` prop을 사용한다.
 */
export function IconBase({
  variant = "md",
  color,
  className,
  children,
  ...props
}: PropsWithChildren<IconProps>) {
  const size = ICON_SIZES[variant];

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      className={cn(color ? undefined : "text-gray-900", className)}
      {...props}
    >
      {children}
    </Svg>
  );
}
