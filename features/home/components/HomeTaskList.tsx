import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Bottom } from "@/components/icons";
import { DROPDOWN_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

import {
  HOME_SORT_LABEL,
  HOME_SORTS,
  type HomeFolder,
  type HomeSort,
  type HomeTask,
} from "./homeData";
import { HomeTaskCard } from "./HomeTaskCard";

type HomeTaskListProps = {
  tasks: readonly HomeTask[];
  folders: readonly HomeFolder[];
  sort: HomeSort;
  onSortChange: (sort: HomeSort) => void;
  onTaskPress: (task: HomeTask) => void;
};

export function HomeTaskList({
  tasks,
  folders,
  sort,
  onSortChange,
  onTaskPress,
}: HomeTaskListProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  return (
    <View className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-900 text-h-04">과제 목록</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`정렬: ${HOME_SORT_LABEL[sort]}`}
          hitSlop={8}
          onPress={() => setIsSortOpen((prev) => !prev)}
          className="flex-row items-center gap-0.5"
        >
          <Text className="text-gray-600 text-b-04-r">
            {HOME_SORT_LABEL[sort]}
          </Text>
          <Bottom variant="sm" className="text-gray-600" />
        </Pressable>
      </View>

      <View className="gap-3">
        {tasks.map((task) => {
          const folder = folders.find(({ id }) => id === task.folderId);
          return (
            <HomeTaskCard
              key={task.id}
              folderName={folder?.name ?? ""}
              color={folder?.color ?? "sub-null"}
              title={task.title}
              typeLabel={task.type === "TEAM" ? "팀" : "개인"}
              dDay={task.dDay}
              progressRate={task.progressRate}
              onPress={() => onTaskPress(task)}
            />
          );
        })}
      </View>

      {/* 카드 위에 겹치도록 마지막에 둔다. 섹션 안쪽이라 안드로이드에서도 터치가 들어온다. */}
      {isSortOpen ? (
        <View
          style={DROPDOWN_SHADOW}
          className="absolute right-0 top-[31px] rounded-sm bg-gray-0"
        >
          {HOME_SORTS.map((key, index) => (
            <Pressable
              key={key}
              accessibilityRole="menuitem"
              onPress={() => {
                onSortChange(key);
                setIsSortOpen(false);
              }}
              className={cn(
                "border-gray-100 py-1 pl-2 pr-4",
                index === 1 ? "border-y" : ""
              )}
            >
              <Text
                className={
                  key === sort
                    ? "text-gray-800 text-b-04-m"
                    : "text-gray-600 text-b-04-r"
                }
              >
                {HOME_SORT_LABEL[key]}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}
