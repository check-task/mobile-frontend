import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

import { Add } from "@/components/icons";
import { cn } from "@/lib/utils";

const DEFAULT_ICON = <Add variant="sm" className="text-gray-600" />;

export type IconButtonProps = {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  className?: string;
};

export function IconButton({
  label,
  icon = DEFAULT_ICON,
  onPress,
  className,
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={cn(
        "h-10 w-full flex-row items-center gap-1 rounded-lg border border-gray-100 bg-gray-0 px-3 py-2.5",
        className
      )}
    >
      {icon}
      <Text className="text-gray-600 text-b-04-m">{label}</Text>
    </Pressable>
  );
}
