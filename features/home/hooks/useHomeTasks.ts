import { useState } from "react";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";
import { getErrorMessage } from "@/lib/errorMessage";

import type { CalendarItem, HomeSort, HomeTask } from "../components/homeData";

import { useHomeTasksQuery } from "./useHomeTasksQuery";
import {
  type MoveDeadlineInput,
  useMoveDeadlineMutation,
} from "./useMoveDeadlineMutation";

const SUB_TASK_AFTER_TASK_MESSAGE = "마감일 이전 날짜로 설정할 수 없습니다.";
// 서버 400 reason 과 같은 문구
const TASK_BEFORE_SUB_TASK_MESSAGE =
  "세부 과제의 마감일보다 이른 날짜로 변경할 수 없습니다.";

const EMPTY: never[] = [];

// 폴더 칩 다중 선택, 캘린더·날짜 미지정 TASK 항목, 과제 목록 정렬
export function useHomeTasks() {
  const { showToast } = useToast();
  const [sort, setSort] = useState<HomeSort>("PRIORITY");
  const tasksQuery = useHomeTasksQuery(sort);
  const { mutate: moveDeadline } = useMoveDeadlineMutation();
  const tasks = tasksQuery.data?.tasks ?? EMPTY;
  const subTasks = tasksQuery.data?.subTasks ?? EMPTY;
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

  const taskById = new Map(tasks.map((task) => [task.id, task]));
  const isVisible = (task: HomeTask) =>
    selectedFolderIds.size === 0 ||
    (task.folderId !== null && selectedFolderIds.has(task.folderId));

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
      color: task.color,
    })
  );
  visibleSubTasks.forEach(({ subTask, parent }) => {
    if (subTask.deadline) {
      addItem(subTask.deadline, {
        key: `sub-${subTask.id}`,
        id: subTask.id,
        kind: "sub",
        title: subTask.title,
        color: parent.color,
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
      color: parent.color,
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
      folderName: task.folderName,
      color: task.color,
    }));

  const save = (input: MoveDeadlineInput) =>
    moveDeadline(input, {
      // 완료된 세부 task 는 목록에 없어 서버만 막을 수 있다 → 원위치(mutation) + 토스트.
      // 과제 충돌은 서버 reason 이 TASK_BEFORE_SUB_TASK_MESSAGE 와 같다
      onError: (error) => {
        const isSubTaskAfterTask =
          error instanceof ApiError && error.errorCode === "INVALID_DEADLINE";
        showToast(
          "fail",
          isSubTaskAfterTask
            ? SUB_TASK_AFTER_TASK_MESSAGE
            : getErrorMessage(error, "마감일을 바꾸지 못했습니다.")
        );
      },
    });

  /**
   * 드롭한 날짜(시간 없음)로 마감일을 바꾼다. `null` 은 날짜 미지정(세부 task 만).
   * 마감일 순서가 어긋나면 바꾸지 않고 토스트를 띄운다.
   * 날짜는 YYYY-MM-DD 라 문자열 비교로 순서를 판단한다.
   */
  const moveItem = (item: CalendarItem, dateKey: string | null) => {
    if (item.kind === "main") {
      // 과제는 마감일이 필수라 미지정 영역에 놓으면 원래 자리로 돌아간다
      if (dateKey === null) return;
      const task = taskById.get(item.id);
      if (task?.deadline === dateKey) return;
      const hasLaterSubTask = subTasks.some(
        (sub) =>
          sub.taskId === item.id &&
          sub.deadline !== null &&
          sub.deadline > dateKey
      );
      if (hasLaterSubTask) {
        showToast("fail", TASK_BEFORE_SUB_TASK_MESSAGE);
        return;
      }
      save({ kind: "main", id: item.id, dateKey });
      return;
    }
    const subTask = subTasks.find(({ id }) => id === item.id);
    if (subTask?.deadline === dateKey) return;
    const parent = subTask && taskById.get(subTask.taskId);
    if (dateKey !== null && parent && dateKey > parent.deadline) {
      showToast("fail", SUB_TASK_AFTER_TASK_MESSAGE);
      return;
    }
    save({ kind: "sub", id: item.id, dateKey });
  };

  return {
    isError: tasksQuery.isError,
    moveItem,
    selectedFolderIds,
    toggleFolder,
    itemsByDate,
    unscheduledItems,
    getDayItems,
    sort,
    setSort,
    // 서버가 sort 대로 정렬해서 준다. 진척도순만 서버가 낮은 순이라 높은 순으로 뒤집는다(같은 값은 서버 순서 유지)
    sortedTasks:
      sort === "PROGRESSRATE"
        ? [...tasks].sort((a, b) => b.progressRate - a.progressRate)
        : tasks,
  };
}
