import { Pressable, Text, View } from "react-native";

import { Share } from "@/components/icons";
import { cn } from "@/lib/utils";

export type TeamMember = {
  id: string;
  name: string;
  /** 역할 라벨 (예: `Owner`, `member(you)`) */
  role: string;
};

export type TeamMemberSectionProps = {
  /** 팀원 목록 */
  members: readonly TeamMember[];
  /** `팀원초대`를 눌렀을 때 */
  onInvitePress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function TeamMemberSection({
  members,
  onInvitePress,
  className,
}: TeamMemberSectionProps) {
  return (
    <View className={cn("gap-4", className)}>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900 text-b-02-m">팀원</Text>
        <Pressable
          accessibilityRole={onInvitePress ? "button" : undefined}
          onPress={onInvitePress}
          className="h-6 flex-row items-center justify-center gap-1 rounded bg-blue-50 pl-[6px] pr-2"
        >
          <Share variant="sm" className="text-blue-500" />
          <Text className="text-blue-500 text-b-04-m">팀원초대</Text>
        </Pressable>
      </View>
      <View className="gap-4 rounded-lg bg-gray-0 px-3 py-4">
        {members.map((member) => (
          <View
            key={member.id}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-1">
              <View className="h-4 w-4 rounded-full bg-blue-200" />
              <Text className="text-gray-800 text-b-04-r">{member.name}</Text>
            </View>
            <Text className="text-gray-800 text-b-04-r">{member.role}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
