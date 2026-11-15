import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addSubTask, taskKeys } from "../api/taskApi";
import type { AddSubTaskRequest } from "../api/task.types";

export function useAddSubTaskMutation(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddSubTaskRequest) => addSubTask(taskId, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) }),
  });
}
