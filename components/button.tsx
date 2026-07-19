import { Pressable, Text } from "react-native";

export function Button({ label }: { label: string }) {
  return (
    <Pressable className="items-center justify-center rounded-lg bg-blue-600 px-4 py-3">
      <Text className="text-base font-semibold text-white">{label}</Text>
    </Pressable>
  );
}
