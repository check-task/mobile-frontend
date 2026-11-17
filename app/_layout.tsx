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
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import "@/global.css";

import { themeVars } from "@/constants/theme-vars";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ModalProvider } from "@/providers/ModalProvider";
import { PushNotificationHost } from "@/providers/PushNotificationHost";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <View className="flex-1 bg-bg" style={themeVars[scheme]}>
          <Stack screenOptions={{ headerShown: false }} />
          <ModalProvider />
          <ToastProvider />
          <PushNotificationHost />
          {/* auto 는 기기 설정을 따라가서, 앱에서 고른 테마에 맞춘다 */}
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        </View>
      </ThemeProvider>
    </QueryProvider>
  );
}
