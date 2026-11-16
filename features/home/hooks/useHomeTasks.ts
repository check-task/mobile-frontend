import { useState } from "react";

import {
  type CalendarItem,
  HOME_FOLDERS,
  HOME_SUB_TASKS,
  HOME_TASKS,
  type HomeSort,
  type HomeTask,
} from "../components/homeData";

const SORT_COMPARE: Record<HomeSort, (a: HomeTask, b: HomeTask) => number> = {
  PRIORITY: (a, b) => a.priority - b.priority,
  DEADLINE: (a, b) => a.deadline.localeCompare(b.deadline),
  PROGRESSRATE: (a, b) => b.progressRate - a.progressRate,
};

// 폴더 칩 다중 선택, 캘린더·날짜 미지정 TASK 항목, 과제 목록 정렬
export function useHomeTasks() {
  const [sort, setSort] = useState<HomeSort>("PRIORITY");
  // 비어 있으면 전체 폴더를 보여 준다
  const [selectedFolderIds, setSelectedFolderIds] = useState<
    ReadonlySet<number>
  >(new Set());

  const toggleFolder = (id: number) => {
    setSelectedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const folderById = new Map(HOME_FOLDERS.map((folder) => [folder.id, folder]));
  const taskById = new Map(HOME_TASKS.map((task) => [task.id, task]));
  const colorOf = (task: HomeTask) =>
    folderById.get(task.folderId)?.color ?? "sub-null";
  const isVisible = (task: HomeTask) =>
    selectedFolderIds.size === 0 || selectedFolderIds.has(task.folderId);

  const visibleTasks = HOME_TASKS.filter(isVisible);
  const visibleSubTasks = HOME_SUB_TASKS.flatMap((subTask) => {
    const parent = taskById.get(subTask.taskId);
    return parent && isVisible(parent) ? [{ subTask, parent }] : [];
  });

  const itemsByDate = new Map<string, CalendarItem[]>();
  const addItem = (dateKey: string, item: CalendarItem) =>
    itemsByDate.set(dateKey, [...(itemsByDate.get(dateKey) ?? []), item]);
  visibleTasks.forEach((task) =>
    addItem(task.deadline, {
      key: `task-${task.id}`,
      kind: "main",
      title: task.title,
      color: colorOf(task),
    })
  );
  visibleSubTasks.forEach(({ subTask, parent }) => {
    if (subTask.deadline) {
      addItem(subTask.deadline, {
        key: `sub-${subTask.id}`,
        kind: "sub",
        title: subTask.title,
        color: colorOf(parent),
      });
    }
  });

  const unscheduledItems: CalendarItem[] = visibleSubTasks
    .filter(({ subTask }) => subTask.deadline === null)
    .map(({ subTask, parent }) => ({
      key: `sub-${subTask.id}`,
      kind: "sub",
      title: subTask.title,
      color: colorOf(parent),
    }));

  // 날짜 모달 목록. 세부 task 는 부모 과제 상세로 이동하도록 부모를 같이 준다
  const getDayItems = (dateKey: string) =>
    [
      ...visibleTasks
        .filter((task) => task.deadline === dateKey)
        .map((task) => ({ key: `task-${task.id}`, task, title: task.title })),
      ...visibleSubTasks
        .filter(({ subTask }) => subTask.deadline === dateKey)
        .map(({ subTask, parent }) => ({
          key: `sub-${subTask.id}`,
          task: parent,
          title: subTask.title,
        })),
    ].map(({ key, task, title }) => ({
      key,
      task,
      title,
      folderName: folderById.get(task.folderId)?.name ?? "",
      color: colorOf(task),
    }));

  // shortcut: 더미라 클라이언트에서 정렬한다. API 연동(#66) 때 GET /task?sort= 결과를 그대로 쓴다.
  const sortedTasks = [...HOME_TASKS].sort(SORT_COMPARE[sort]);

  return {
    selectedFolderIds,
    toggleFolder,
    itemsByDate,
    unscheduledItems,
    getDayItems,
    sort,
    setSort,
    sortedTasks,
  };
}
