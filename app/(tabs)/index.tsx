import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className={cn("text-lg font-bold text-red-500", "underline")}>
        NativeWind test
      </Text>
    </View>
  );
}
