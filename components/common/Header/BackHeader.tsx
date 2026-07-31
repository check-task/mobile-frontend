import { Pressable, Text } from "react-native";

import { Left } from "@/components/icons";

import { HeaderContainer } from "./HeaderContainer";

export type BackHeaderProps = {
  label?: string;
  onBack?: () => void;
  className?: string;
};

export function BackHeader({ label, onBack, className }: BackHeaderProps) {
  return (
    <HeaderContainer className={className}>
      <Pressable
        accessibilityRole={onBack ? "button" : undefined}
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={8}
        className="flex-row items-center gap-1"
      >
        <Left variant="lg" className="text-gray-800" />
        {label ? (
          <Text className="text-gray-800 text-b-01-m">{label}</Text>
        ) : null}
      </Pressable>
    </HeaderContainer>
  );
}
