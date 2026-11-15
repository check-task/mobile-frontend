import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createReference, createTask, taskKeys } from "../api/taskApi";
import type { CreateTaskRequest } from "../api/task.types";
import type { ResourceDraft } from "../api/taskForm.types";
import { toReferenceParams } from "../api/taskMapper";

export type CreateTaskInput = {
  task: CreateTaskRequest;
  references: ResourceDraft[];
};

/** 과제를 만든 뒤 자료를 하나씩 올린다. 자료 실패는 과제 생성을 되돌리지 않고 개수만 돌려준다. */
export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ task, references }: CreateTaskInput) => {
      const { taskId } = await createTask(task);
      const results = await Promise.allSettled(
        references
          .map(toReferenceParams)
          .filter((params) => params !== null)
          .map((params) => createReference(taskId, params))
      );
      const failedReferenceCount = results.filter(
        (result) => result.status === "rejected"
      ).length;
      return { taskId, failedReferenceCount };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskKeys.all }),
  });
}
