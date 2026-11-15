import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskKeys, updateSubTaskStatus } from "../api/taskApi";
import type { SubTaskStatus } from "../api/task.types";

export function useUpdateSubTaskStatusMutation(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subTaskId,
      status,
    }: {
      subTaskId: number;
      status: SubTaskStatus;
    }) => updateSubTaskStatus(subTaskId, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) }),
  });
}
