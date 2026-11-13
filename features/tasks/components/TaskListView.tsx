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
};

// 내 과제, 완료 과제 공통 레이아웃
export function TaskListView({ title, status, tasks }: TaskListViewProps) {
  const insets = useSafeAreaInsets();
  const [scope, setScope] = useState<TaskScope>("personal");
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
      {/* 메뉴 화면 만들어지면 onMenuPress 연결 (지금은 메뉴 아이콘 안 보임) */}
      <LogoHeader />
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
          // 과제 상세 화면 만들어지면 onPress 연결
          return status === "ongoing" ? (
            <TaskCard key={task.id} type="ing" dday={task.dday} {...common} />
          ) : (
            <TaskCard
              key={task.id}
              type="history"
              date={task.completedDate}
              {...common}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}
