import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-bg px-4">
      <Text className="text-gray-900 text-h-04">비밀번호 찾기</Text>
      <Button label="Button" />
    </View>
  );
}
