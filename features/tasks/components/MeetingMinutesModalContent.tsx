import { Text, View } from "react-native";

import { Input } from "@/components/common/Input/Input";
import { cn } from "@/lib/utils";

export type MeetingMinutesModalContentProps = {
  /** 입력 중인 안건 */
  agenda: string;
  /** 안건이 바뀔 때 */
  onChangeAgenda: (text: string) => void;
  /** 입력 중인 결과 */
  result: string;
  /** 결과가 바뀔 때 */
  onChangeResult: (text: string) => void;
  /** 입력 중인 URL 경로 */
  urlPath: string;
  /** URL 경로가 바뀔 때 */
  onChangeUrlPath: (text: string) => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function MeetingMinutesModalContent({
  agenda,
  onChangeAgenda,
  result,
  onChangeResult,
  urlPath,
  onChangeUrlPath,
  className,
}: MeetingMinutesModalContentProps) {
  const fields = [
    {
      key: "agenda",
      label: "안건",
      placeholder: "회의 안건을 입력하세요.",
      value: agenda,
      onChange: onChangeAgenda,
    },
    {
      key: "result",
      label: "결과",
      placeholder: "회의 결과를 입력하세요.",
      value: result,
      onChange: onChangeResult,
    },
    {
      key: "urlPath",
      label: "URL경로",
      placeholder: "논의사항을 입력하세요.",
      value: urlPath,
      onChange: onChangeUrlPath,
    },
  ] as const;

  return (
    <View className={cn("gap-3 py-5", className)}>
      {fields.map((field) => (
        <View key={field.key} className="gap-3">
          <Text className="text-gray-900 text-b-02-r">{field.label}</Text>
          <Input
            shape="modal"
            multiline
            textAlignVertical="top"
            value={field.value}
            onChangeText={field.onChange}
            placeholder={field.placeholder}
            className="min-h-14"
          />
        </View>
      ))}
    </View>
  );
}
