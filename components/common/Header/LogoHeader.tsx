import { Image, type ImageStyle } from "expo-image";
import { Pressable, View } from "react-native";

import { Hamburger } from "@/components/icons";

import { HeaderContainer } from "./HeaderContainer";

const LOGO_STYLE = { width: 152, height: 28 } satisfies ImageStyle;

export type LogoHeaderProps = {
  onMenuPress?: () => void;
  className?: string;
};

export function LogoHeader({ onMenuPress, className }: LogoHeaderProps) {
  return (
    <HeaderContainer className={className}>
      <View className="w-full flex-row items-center justify-between">
        <Image
          source={require("@/assets/images/checktask-logo.png")}
          style={LOGO_STYLE}
          contentFit="contain"
          accessibilityLabel="CheckTask"
        />
        <Pressable
          accessibilityRole={onMenuPress ? "button" : undefined}
          accessibilityLabel="메뉴 열기"
          onPress={onMenuPress}
          hitSlop={8}
        >
          <Hamburger variant="lg" className="text-gray-800" />
        </Pressable>
      </View>
    </HeaderContainer>
  );
}
