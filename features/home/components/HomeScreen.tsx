import { useRouter } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoHeader } from "@/components/common/Header/LogoHeader";

export function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      <LogoHeader onMenuPress={() => router.navigate("/menu")} />
    </View>
  );
}
