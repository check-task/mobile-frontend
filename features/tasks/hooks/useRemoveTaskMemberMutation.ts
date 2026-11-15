import { useMutation, useQueryClient } from "@tanstack/react-query";

import { removeTaskMember, taskKeys } from "../api/taskApi";

export function useRemoveTaskMemberMutation(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => removeTaskMember(taskId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.members(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
    },
  });
}
