import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
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
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <View className="flex-1 bg-bg" style={themeVars[scheme]}>
        <Stack screenOptions={{ headerShown: false }} />
        <ModalProvider />
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}
