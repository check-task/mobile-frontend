import type { ReactNode } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export type HeaderContainerProps = {
  children: ReactNode;
  className?: string;
};

export function HeaderContainer({ children, className }: HeaderContainerProps) {
  return (
    <View
      className={cn(
        "h-14 w-full flex-row items-center border-b border-gray-100 bg-gray-0 px-4 py-2.5",
        className
      )}
    >
      {children}
    </View>
  );
}
