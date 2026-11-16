import { useState } from "react";

import {
  type CalendarItem,
  HOME_FOLDERS,
  HOME_SUB_TASKS,
  HOME_TASKS,
  type HomeSort,
  type HomeSubTask,
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
  const [tasks, setTasks] = useState<readonly HomeTask[]>(HOME_TASKS);
  const [subTasks, setSubTasks] =
    useState<readonly HomeSubTask[]>(HOME_SUB_TASKS);
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
  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const colorOf = (task: HomeTask) =>
    folderById.get(task.folderId)?.color ?? "sub-null";
  const isVisible = (task: HomeTask) =>
    selectedFolderIds.size === 0 || selectedFolderIds.has(task.folderId);

  const visibleTasks = tasks.filter(isVisible);
  const visibleSubTasks = subTasks.flatMap((subTask) => {
    const parent = taskById.get(subTask.taskId);
    return parent && isVisible(parent) ? [{ subTask, parent }] : [];
  });

  const itemsByDate = new Map<string, CalendarItem[]>();
  const addItem = (dateKey: string, item: CalendarItem) =>
    itemsByDate.set(dateKey, [...(itemsByDate.get(dateKey) ?? []), item]);
  visibleTasks.forEach((task) =>
    addItem(task.deadline, {
      key: `task-${task.id}`,
      id: task.id,
      kind: "main",
      title: task.title,
      color: colorOf(task),
    })
  );
  visibleSubTasks.forEach(({ subTask, parent }) => {
    if (subTask.deadline) {
      addItem(subTask.deadline, {
        key: `sub-${subTask.id}`,
        id: subTask.id,
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
      id: subTask.id,
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
  const sortedTasks = [...tasks].sort(SORT_COMPARE[sort]);

  // TODO(api): PATCH /task/{taskId}/deadline {deadline} · PATCH /task/subtask/{subTaskId}/deadline {endDate}
  /**
   * 드롭한 날짜(시간 없음)로 마감일을 바꾼다. `null` 은 날짜 미지정(세부 task 만).
   * 세부 task 를 부모 과제 마감일 이후로 옮기려 하면 바꾸지 않고 `false`.
   */
  const moveItem = (item: CalendarItem, dateKey: string | null) => {
    if (item.kind === "main") {
      // 과제는 마감일이 필수라 미지정 영역에 놓으면 원래 자리로 돌아간다
      if (dateKey === null) return true;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === item.id ? { ...task, deadline: dateKey } : task
        )
      );
      return true;
    }
    const subTask = subTasks.find(({ id }) => id === item.id);
    const parent = subTask && taskById.get(subTask.taskId);
    // YYYY-MM-DD 라 문자열 비교로 날짜 순서를 판단한다
    if (dateKey !== null && parent && dateKey > parent.deadline) return false;
    setSubTasks((prev) =>
      prev.map((sub) =>
        sub.id === item.id ? { ...sub, deadline: dateKey } : sub
      )
    );
    return true;
  };

  return {
    moveItem,
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
