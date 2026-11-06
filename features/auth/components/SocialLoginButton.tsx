import { Image, type ImageSource, type ImageStyle } from "expo-image";
import { Pressable, Text } from "react-native";

import {
  APPLE_BUTTON_COLORS,
  KAKAO_BUTTON_COLORS,
} from "@/constants/brandColors";

export type SocialLoginProvider = "kakao" | "apple";

type SocialLoginConfig = {
  label: string;
  icon: ImageSource;
  iconStyle: ImageStyle;
  colors: { container: string; label: string };
};

const SOCIAL_LOGIN_CONFIG: Record<SocialLoginProvider, SocialLoginConfig> = {
  kakao: {
    label: "카카오 로그인",
    icon: require("@/assets/images/kakao-symbol.png"),
    iconStyle: { width: 16, height: 18 },
    colors: KAKAO_BUTTON_COLORS,
  },
  apple: {
    label: "Apple로 로그인",
    icon: require("@/assets/images/apple-logo.png"),
    iconStyle: { width: 16, height: 19.656 },
    colors: APPLE_BUTTON_COLORS,
  },
};

type SocialLoginButtonProps = {
  provider: SocialLoginProvider;
  onPress?: () => void;
};

export function SocialLoginButton({
  provider,
  onPress,
}: SocialLoginButtonProps) {
  const { label, icon, iconStyle, colors } = SOCIAL_LOGIN_CONFIG[provider];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-12 w-full flex-row items-center justify-center gap-2 rounded-lg"
      style={{ backgroundColor: colors.container }}
    >
      <Image source={icon} style={iconStyle} contentFit="contain" />
      <Text className="text-btn" style={{ color: colors.label }}>
        {label}
      </Text>
    </Pressable>
  );
}
