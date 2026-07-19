import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text
        className={cn("text-lg text-black")}
        style={{ fontFamily: "Inter_600SemiBold" }}
      >
        비밀번호 찾기
      </Text>
    </View>
  );
}
