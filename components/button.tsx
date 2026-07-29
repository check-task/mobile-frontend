import { Pressable, Text } from "react-native";

export function Button({ label }: { label: string }) {
  return (
    <Pressable className="items-center justify-center rounded-lg bg-primary px-4 py-3">
      <Text className="text-primary-button-text text-btn">{label}</Text>
    </Pressable>
  );
}
