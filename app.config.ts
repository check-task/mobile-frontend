import type { ConfigContext, ExpoConfig } from "expo/config";

// 카카오 네이티브 앱 키. .env.local(로컬) 또는 EAS 환경 변수로 넣는다
const kakaoAppKey = process.env.KAKAO_NATIVE_APP_KEY;

// app.json 설정에 키가 필요한 플러그인만 더한다
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "mobile-frontend",
  slug: config.slug ?? "mobile-frontend",
  plugins: [
    ...(config.plugins ?? []),
    // 키 없이 빌드하면 플러그인이 실패해서, 키가 있을 때만 넣는다 (Expo Go·웹 개발은 키가 없어도 된다)
    ...(kakaoAppKey
      ? [
          ["@react-native-seoul/kakao-login", { kakaoAppKey }] as [
            string,
            object,
          ],
        ]
      : []),
  ],
});
