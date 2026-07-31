import { Pressable, Text } from "react-native";

import { cn } from "@/lib/utils";

export type ButtonStyle = "blue" | "gray" | "outline" | "white";
export type ButtonSize = "tiny" | "sm" | "modal" | "lg" | "xl";

const VARIANT_CLASS: Record<ButtonStyle, string> = {
  blue: "bg-primary",
  gray: "bg-gray-100",
  outline: "border border-primary bg-bg",
  // white는 xl 전용 색상
  white: "bg-gray-0",
};

const VARIANT_TEXT_CLASS: Record<ButtonStyle, string> = {
  blue: "text-gray-0",
  gray: "text-gray-600",
  outline: "text-primary",
  white: "text-gray-600",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  tiny: "w-auto rounded-full px-3 py-1.5",
  sm: "w-[84px] rounded py-2",
  modal: "h-11 rounded-lg p-2.5",
  lg: "h-12 rounded-lg p-2.5",
  xl: "h-12 p-2.5",
};

const SIZE_TEXT_CLASS: Record<ButtonSize, string> = {
  tiny: "text-b-04-m",
  sm: "text-b-04-m",
  modal: "text-b-02-m",
  lg: "text-btn",
  xl: "text-btn",
};

export type ButtonProps = {
  label: string;
  variant?: ButtonStyle;
  size?: ButtonSize;
  onPress?: () => void;
  disabled?: boolean;
  className?: string;
};

export function Button({
  label,
  variant = "blue",
  size = "lg",
  onPress,
  disabled = false,
  className,
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "w-full items-center justify-center",
        SIZE_CLASS[size],
        disabled ? "bg-gray-200" : VARIANT_CLASS[variant],
        className
      )}
    >
      <Text
        className={cn(
          disabled ? "text-gray-400" : VARIANT_TEXT_CLASS[variant],
          SIZE_TEXT_CLASS[size]
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}
