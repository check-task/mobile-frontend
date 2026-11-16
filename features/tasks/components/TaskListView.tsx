import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { TaskCard } from "@/components/common/TaskCard/TaskCard";
import { useToast } from "@/hooks/useToast";

import type {
  TaskFolder,
  TaskListItem,
  TaskScope,
} from "../api/taskList.types";
import { useFolderFilter } from "../hooks/useFolderFilter";
import { useTaskFoldersQuery } from "../hooks/useTaskFoldersQuery";
import { FolderFilter } from "./FolderFilter";
import { TaskScopeTabs } from "./TaskScopeTabs";

// 마지막 카드 아래 여백
const CONTENT_BOTTOM_OFFSET = 24;

type TaskListViewProps = {
  title: string;
  // ongoing은 D-day, completed는 완료 날짜 표시
  status: "ongoing" | "completed";
  tasks: readonly TaskListItem[];
  // 목록을 못 불러왔으면 토스트로 알린다
  isError?: boolean;
  initialScope?: TaskScope;
};

const NO_FOLDERS: TaskFolder[] = [];

// 내 과제, 완료 과제 공통 레이아웃
export function TaskListView({
  title,
  status,
  tasks,
  isError = false,
  initialScope = "personal",
}: TaskListViewProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [scope, setScope] = useState<TaskScope>(initialScope);
  const foldersQuery = useTaskFoldersQuery();
  const folders = foldersQuery.data ?? NO_FOLDERS;
  const folderFilter = useFolderFilter(folders);

  useEffect(() => {
    if (isError) showToast("fail", "과제 목록을 불러오지 못했어요.");
  }, [isError, showToast]);

  // 폴더가 없는 과제는 모든 과제를 볼 때만 보여준다
  const filteredTasks = tasks.filter((task) =>
    task.folderId === null
      ? folderFilter.isAllSelected
      : folderFilter.selectedIds.has(task.folderId)
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
            folders={folders}
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
          const common = {
            folderName: task.folderName,
            folderColor: task.folderColor,
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
