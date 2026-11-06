import { Image, type ImageStyle } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

const SPLASH_DURATION_MS = 1500;

const LOGO_STYLE = { width: 285.411, height: 50.529 } satisfies ImageStyle;

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, SPLASH_DURATION_MS);

    return () => clearTimeout(timer);
  }, [router]);

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
