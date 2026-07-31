import { Pressable } from "react-native";

import { Cancel } from "@/components/icons";

import { HeaderContainer } from "./HeaderContainer";

export type CloseHeaderProps = {
  onClose?: () => void;
  className?: string;
};

export function CloseHeader({ onClose, className }: CloseHeaderProps) {
  return (
    <HeaderContainer className={className}>
      <Pressable
        accessibilityRole={onClose ? "button" : undefined}
        accessibilityLabel="닫기"
        onPress={onClose}
        hitSlop={8}
        className="ml-auto"
      >
        <Cancel variant="xl" color="text-gray-800" />
      </Pressable>
    </HeaderContainer>
  );
}
