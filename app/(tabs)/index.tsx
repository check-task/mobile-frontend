import { Text, View } from "react-native";

import { Button } from "@/components/button";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-bg">
      <Text className="text-gray-900 text-h-04">비밀번호 찾기</Text>
      <Button label="Button" />
    </View>
  );
}
