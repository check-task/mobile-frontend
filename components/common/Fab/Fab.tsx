import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Add, Cancel, TaskGenerate, TaskJoin } from "@/components/icons";
import { FAB_PRIMARY_SHADOW, FAB_SECONDARY_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

export type FabProps = {
  onCreateTask?: () => void;
  onJoinTeamTask?: () => void;
  defaultOpen?: boolean;
  className?: string;
};

export function Fab({
  onCreateTask,
  onJoinTeamTask,
  defaultOpen = false,
  className,
}: FabProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  function handleCreateTask() {
    setIsOpen(false);
    onCreateTask?.();
  }

  function handleJoinTeamTask() {
    setIsOpen(false);
    onJoinTeamTask?.();
  }

  return (
    <View className={cn("items-end gap-3", className)}>
      {isOpen ? (
        <>
          <View className="flex-row items-center gap-4">
            <Text className="text-gray-0 text-b-01-m">새 과제 생성</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="새 과제 생성"
              onPress={handleCreateTask}
              style={FAB_SECONDARY_SHADOW}
              className="size-[60px] items-center justify-center rounded-full bg-gray-100"
            >
              <TaskGenerate variant="2xl" className="text-gray-800" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4">
            <Text className="text-gray-0 text-b-01-m">팀 과제 참여</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="팀 과제 참여"
              onPress={handleJoinTeamTask}
              style={FAB_SECONDARY_SHADOW}
              className="size-[60px] items-center justify-center rounded-full bg-gray-100"
            >
              <TaskJoin variant="2xl" className="text-gray-800" />
            </Pressable>
          </View>
        </>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={isOpen ? "닫기" : "새 과제 만들기"}
        onPress={() => setIsOpen((prev) => !prev)}
        style={FAB_PRIMARY_SHADOW}
        className="size-[60px] items-center justify-center rounded-full bg-blue-500"
      >
        {isOpen ? (
          <Cancel variant="2xl" className="text-primary-button-text" />
        ) : (
          <Add variant="2xl" className="text-primary-button-text" />
        )}
      </Pressable>
    </View>
  );
}
