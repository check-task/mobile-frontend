import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { TaskCard } from "@/components/common/TaskCard/TaskCard";

import { useFolderFilter } from "../hooks/useFolderFilter";
import { FolderFilter } from "./FolderFilter";
import {
  TASK_FOLDERS,
  type TaskListItem,
  type TaskScope,
} from "./taskListData";
import { TaskScopeTabs } from "./TaskScopeTabs";

// 마지막 카드 아래 여백
const CONTENT_BOTTOM_OFFSET = 24;

type TaskListViewProps = {
  title: string;
  // ongoing은 D-day, completed는 완료 날짜 표시
  status: "ongoing" | "completed";
  tasks: readonly TaskListItem[];
  initialScope?: TaskScope;
};

// 내 과제, 완료 과제 공통 레이아웃
export function TaskListView({
  title,
  status,
  tasks,
  initialScope = "personal",
}: TaskListViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scope, setScope] = useState<TaskScope>(initialScope);
  const folderFilter = useFolderFilter(TASK_FOLDERS);

  const filteredTasks = tasks.filter((task) =>
    folderFilter.selectedIds.has(task.folderId)
  );
  const counts: Record<TaskScope, number> = {
    personal: filteredTasks.filter((task) => task.scope === "personal").length,
    team: filteredTasks.filter((task) => task.scope === "team").length,
  };
  const visibleTasks = filteredTasks.filter((task) => task.scope === scope);

  return (
    <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
      <LogoHeader onMenuPress={() => router.navigate("/menu")} />
      <View className="gap-4 px-4 pt-5">
        <View className="h-[33px] flex-row items-center justify-between">
          <Text className="text-gray-900 text-h-02">{title}</Text>
          <FolderFilter
            folders={TASK_FOLDERS}
            selectedIds={folderFilter.selectedIds}
            isAllSelected={folderFilter.isAllSelected}
            firstSelected={folderFilter.firstSelected}
            selectedCount={folderFilter.selectedCount}
            onSelectAll={folderFilter.selectAll}
            onToggleFolder={folderFilter.toggleFolder}
          />
        </View>
        <TaskScopeTabs value={scope} counts={counts} onChange={setScope} />
      </View>
      <ScrollView
        contentContainerClassName="gap-3 px-4 pt-3"
        contentContainerStyle={{
          paddingBottom: insets.bottom + CONTENT_BOTTOM_OFFSET,
        }}
      >
        {visibleTasks.map((task) => {
          const folder = TASK_FOLDERS.find(({ id }) => id === task.folderId);
          const common = {
            folderName: folder?.name ?? "",
            folderColor: folder?.color,
            title: task.title,
          };
          return status === "ongoing" ? (
            <TaskCard
              key={task.id}
              type="ing"
              dday={task.dday}
              onPress={() =>
                router.push(
                  scope === "team"
                    ? `/tasks/team/${task.id}`
                    : `/tasks/personal/${task.id}`
                )
              }
              {...common}
            />
          ) : (
            <TaskCard
              key={task.id}
              type="history"
              date={task.completedDate}
              onPress={() =>
                router.push(
                  scope === "team"
                    ? `/tasks/team/${task.id}`
                    : `/tasks/personal/${task.id}`
                )
              }
              {...common}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
