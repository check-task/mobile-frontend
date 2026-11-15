import { type ComponentRef, useRef } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { BottomFill, Share } from "@/components/icons";
import { cn } from "@/lib/utils";

import type { AnchorRect } from "./MenuPopover";

export type TeamMember = {
  id: string;
  name: string;
  /** 역할 라벨 (예: `Owner`, `member(you)`) */
  role: string;
  /** 역할 옆 화살표를 눌렀을 때. 넘기면 화살표를 그린다 (팀장이 다른 팀원을 볼 때). 메뉴를 붙일 수 있게 화면 좌표를 넘긴다. */
  onRolePress?: (anchor: AnchorRect) => void;
};

export type TeamMemberSectionProps = {
  /** 팀원 목록 */
  members: readonly TeamMember[];
  /** `팀원초대`를 눌렀을 때 */
  onInvitePress?: () => void;
  /** 넘기면 목록 대신 조회 실패 안내와 `다시 시도` 버튼을 보여 준다. */
  onRetry?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

export function TeamMemberSection({
  members,
  onInvitePress,
  onRetry,
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
        {onRetry ? (
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600 text-b-04-r">
              팀원 목록을 불러오지 못했어요.
            </Text>
            <Button
              label="다시 시도"
              variant="gray"
              size="tiny"
              className="w-auto"
              onPress={onRetry}
            />
          </View>
        ) : null}
        {members.map((member) => (
          <View
            key={member.id}
            className="flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-1">
              <View className="h-4 w-4 rounded-full bg-blue-200" />
              <Text className="text-gray-800 text-b-04-r">{member.name}</Text>
            </View>
            {member.onRolePress ? (
              <RoleMenuButton
                name={member.name}
                role={member.role}
                onPress={member.onRolePress}
              />
            ) : (
              <Text className="text-gray-800 text-b-04-r">{member.role}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

function RoleMenuButton({
  name,
  role,
  onPress,
}: {
  name: string;
  role: string;
  onPress: (anchor: AnchorRect) => void;
}) {
  const ref = useRef<ComponentRef<typeof View>>(null);

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={`${name} 권한 메뉴`}
      hitSlop={8}
      onPress={() =>
        ref.current?.measureInWindow((x, y, width, height) =>
          onPress({ x, y, width, height })
        )
      }
      className="flex-row items-center gap-0.5"
    >
      <Text className="text-gray-800 text-b-04-r">{role}</Text>
      <BottomFill variant="sm" className="text-gray-800" />
    </Pressable>
  );
}
