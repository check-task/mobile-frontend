import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

export type TeamMemberInfoModalContentProps = {
  /** 팀원 닉네임 */
  nickname: string;
  /** 연락처 */
  phone: string;
  /** 이메일 */
  email: string;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function TeamMemberInfoModalContent({
  nickname,
  phone,
  email,
  className,
}: TeamMemberInfoModalContentProps) {
  return (
    <View className={cn("gap-4 py-5", className)}>
      <View className="items-center gap-3">
        <View className="h-[100px] w-[100px] rounded-full bg-gray-200" />
        <Text className="text-gray-900 text-b-02-m">{nickname}</Text>
      </View>
      <View className="mx-3 h-px bg-gray-200" />
      <View className="gap-4">
        <Text className="pl-3 text-gray-900 text-b-02-m">기본정보</Text>
        <View className="gap-3 pl-6">
          <View className="gap-2">
            <Text className="text-gray-600 text-b-02-r">연락처</Text>
            <Text className="text-gray-900 text-b-02-r">{phone}</Text>
          </View>
          <View className="gap-2">
            <Text className="text-gray-600 text-b-02-r">이메일</Text>
            <Text className="text-gray-900 text-b-02-r">{email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
