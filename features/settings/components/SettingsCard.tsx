import type { ReactNode } from "react";
import { View } from "react-native";

import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

type SettingsCardProps = {
  children: ReactNode;
  className?: string;
};

/** 설정 화면의 흰 카드 (알림·폴더·테마) */
export function SettingsCard({ children, className }: SettingsCardProps) {
  return (
    <View
      style={CARD_SHADOW}
      className={cn("rounded-lg bg-gray-0 px-4 py-5", className)}
    >
      {children}
    </View>
  );
}
