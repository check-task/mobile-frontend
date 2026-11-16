import { Image, type ImageStyle } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

import { getTokens } from "@/lib/api/tokenStorage";

const SPLASH_DURATION_MS = 1500;

const LOGO_STYLE = { width: 285.411, height: 50.529 } satisfies ImageStyle;

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      // 저장된 로그인 토큰이 있으면 온보딩·로그인을 건너뛴다
      const tokens = await getTokens();
      if (!cancelled) router.replace(tokens ? "/" : "/onboarding");
    }, SPLASH_DURATION_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
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
