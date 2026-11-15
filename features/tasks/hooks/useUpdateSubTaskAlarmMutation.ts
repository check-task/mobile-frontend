import { useMutation, useQueryClient } from "@tanstack/react-query";

import { taskKeys, updateSubTaskAlarm } from "../api/taskApi";

export function useUpdateSubTaskAlarmMutation(taskId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      subTaskId,
      isAlarm,
    }: {
      subTaskId: number;
      isAlarm: boolean;
    }) => updateSubTaskAlarm(taskId, subTaskId, isAlarm),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) }),
  });
}
