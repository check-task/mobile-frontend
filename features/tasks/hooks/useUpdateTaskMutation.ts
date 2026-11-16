import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toDueDateTime } from "@/lib/dueDate";

import {
  addSubTask,
  createReference,
  deleteReference,
  deleteSubTasks,
  taskKeys,
  updateReference,
  updateTask,
} from "../api/taskApi";
import type { TaskFormValue } from "../api/taskForm.types";
import { toFilePart, toReferenceParams } from "../api/taskMapper";

export type UpdateTaskInput = {
  taskId: number;
  /** 화면을 열 때 서버 값 */
  initial: TaskFormValue;
  value: TaskFormValue;
};

// 서버에서 온 항목 id 는 숫자 문자열, 화면에서 추가한 항목은 `new-` 로 시작한다
const toServerId = (id: string) => (/^\d+$/.test(id) ? Number(id) : null);

/**
 * 폼 값을 초기값과 비교해 한꺼번에 저장한다: 지운 세부 과제 삭제 → 과제 PATCH → 자료 추가·수정·삭제.
 * 자료 실패는 과제 저장을 되돌리지 않고 개수만 돌려준다.
 */
export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, initial, value }: UpdateTaskInput) => {
      if (!value.deadline) throw new Error("마감일이 없습니다.");
      const deadlineTime = toDueDateTime(value.deadline);
      // 제목을 비운 세부 과제는 지운 것으로 본다
      const subTasks = value.subTasks.filter(
        (subTask) => subTask.title.trim().length > 0
      );
      const keptSubTaskIds = new Set(subTasks.map((subTask) => subTask.id));
      const removedSubTaskIds = initial.subTasks
        .filter((subTask) => !keptSubTaskIds.has(subTask.id))
        .map((subTask) => Number(subTask.id));
      if (removedSubTaskIds.length > 0) {
        await deleteSubTasks(taskId, removedSubTaskIds);
      }

      const subTaskBodies = subTasks.map((subTask) => ({
        id: toServerId(subTask.id),
        title: subTask.title.trim(),
        // 되돌리기로 복원된 세부 과제는 그사이 당겨진 과제 마감을 넘을 수 있어 과제 마감으로 맞춘다
        endDate: subTask.dueDate
          ? new Date(
              Math.min(
                toDueDateTime(subTask.dueDate).getTime(),
                deadlineTime.getTime()
              )
            ).toISOString()
          : null,
      }));

      await updateTask(taskId, {
        title: value.title.trim(),
        folderId: value.folderId,
        deadline: deadlineTime.toISOString(),
        subTasks: subTaskBodies.flatMap(({ id, ...body }) =>
          id === null ? [] : [{ id, ...body }]
        ),
      });
      // PATCH 는 id 없는 세부 과제를 만들지 않아서(2026-11-16 확인) 새 세부 과제는 따로 추가한다. 순서를 지키려고 하나씩 보낸다.
      for (const { id, title, endDate } of subTaskBodies) {
        if (id === null) await addSubTask(taskId, { title, deadline: endDate });
      }

      const initialResources = new Map(
        initial.resources.map((resource) => [resource.id, resource])
      );
      const currentIds = new Set(value.resources.map(({ id }) => id));
      const requests = [
        ...initial.resources
          .filter(({ id }) => !currentIds.has(id))
          .map(({ id }) => deleteReference(taskId, Number(id))),
        ...value.resources.map((resource) => {
          const referenceId = toServerId(resource.id);
          if (referenceId === null) {
            const params = toReferenceParams(resource);
            return params && createReference(taskId, params);
          }
          const before = initialResources.get(resource.id);
          const changed =
            resource.file ||
            before?.name !== resource.name ||
            before?.path !== resource.path;
          if (!changed) return null;
          return updateReference(taskId, referenceId, {
            name: resource.name,
            ...(resource.type === "url" && { url: resource.path }),
            ...(resource.file && { file: toFilePart(resource.file) }),
          });
        }),
      ];
      const results = await Promise.allSettled(requests);
      return {
        failedReferenceCount: results.filter(
          (result) => result.status === "rejected"
        ).length,
      };
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
