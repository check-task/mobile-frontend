import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import {
  Inter_400Regular,
  Inter_500Medium,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as NativeSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import "@/global.css";

import { themeVars } from "@/constants/theme-vars";
import { SplashScreen } from "@/features/onboarding/components/SplashScreen";
import { useAppEntryStatus } from "@/hooks/useAppEntryStatus";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ModalProvider } from "@/providers/ModalProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";

NativeSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  const { isLoading, isSignedIn, hasSeenOnboarding } = useAppEntryStatus();
  // 첫 화면을 고르기 전에 그리면 홈이 잠깐 보였다가 넘어가서, 저장된 로그인 정보를 읽을 때까지 기다린다
  const isReady = (loaded || !!error) && !isLoading;
  // 앱을 켤 때마다 한 번 보여준다
  const [showSplash, setShowSplash] = useState(true);
  const hideSplash = useCallback(() => setShowSplash(false), []);

  useEffect(() => {
    if (isReady) {
      NativeSplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View className="flex-1 bg-bg" style={themeVars[scheme]}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* 로그인해야 들어갈 수 있는 화면. 화면을 추가하면 여기에도 넣는다 */}
            <Stack.Protected
              guard={isSignedIn}
              redirectTo={hasSeenOnboarding ? "/login" : "/onboarding"}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="menu" />
              <Stack.Screen name="notice" />
              <Stack.Screen name="notification" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="tasks/index" />
              <Stack.Screen name="tasks/create" />
              <Stack.Screen name="tasks/completed" />
              <Stack.Screen name="tasks/[taskId]/edit" />
              <Stack.Screen name="tasks/personal/[taskId]" />
              <Stack.Screen name="tasks/team/[taskId]" />
            </Stack.Protected>
            {/* 로그인하지 않았을 때만 들어갈 수 있는 화면 */}
            <Stack.Protected guard={!isSignedIn} redirectTo="/">
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup/index" />
              <Stack.Screen name="signup/verify" />
              <Stack.Screen name="signup/password" />
              <Stack.Screen name="signup/profile" />
              <Stack.Screen name="find-password/index" />
              <Stack.Screen name="find-password/verify" />
              <Stack.Screen name="find-password/reset" />
              <Stack.Screen name="find-password/complete" />
            </Stack.Protected>
          </Stack>
          {showSplash && (
            <View className="absolute inset-0">
              <SplashScreen onFinish={hideSplash} />
            </View>
          )}
          <ModalProvider />
          <ToastProvider />
          {/* auto 는 기기 설정을 따라가서, 앱에서 고른 테마에 맞춘다 */}
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        </View>
      </ThemeProvider>
    </QueryProvider>
  );
}
