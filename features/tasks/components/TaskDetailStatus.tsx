import { ActivityIndicator, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

type TaskDetailStatusProps = {
  isError: boolean;
  onRetry: () => void;
};

export function TaskDetailStatus({ isError, onRetry }: TaskDetailStatusProps) {
  return (
    <View className="flex-1 items-center justify-center gap-4 px-4">
      {isError ? (
        <>
          <Text className="text-gray-600 text-b-02-r">
            과제를 불러오지 못했습니다.
          </Text>
          <Button
            label="다시 시도"
            variant="gray"
            size="sm"
            onPress={onRetry}
          />
        </>
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
}
