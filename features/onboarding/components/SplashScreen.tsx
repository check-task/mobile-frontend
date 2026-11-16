import { Image, type ImageStyle } from "expo-image";
import { useEffect } from "react";
import { View } from "react-native";

const SPLASH_DURATION_MS = 1500;

const LOGO_STYLE = { width: 285.411, height: 50.529 } satisfies ImageStyle;

type SplashScreenProps = {
  // 보여준 뒤 부른다. 어느 화면으로 갈지는 app/_layout 이 로그인 여부로 정한다
  onFinish: () => void;
};

export function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Image
        source={require("@/assets/images/checktask-logo-white.svg")}
        style={LOGO_STYLE}
        contentFit="contain"
        accessibilityLabel="CheckTask"
      />
    </View>
  );
}
