import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTask, taskKeys } from "../api/taskApi";

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      // 지워진 상세를 다시 불러오지 않도록 먼저 뺀다
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      return queryClient.invalidateQueries({ queryKey: taskKeys.all });
    },
  });
}
