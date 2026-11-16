import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "@/lib/api/userApi";

import { updateDeadlineAlarm, updateTaskAlarm } from "../api/settingsApi";

export type AlarmKind = "deadlineAlarm" | "taskAlarm";

export function useUpdateAlarmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ kind, hours }: { kind: AlarmKind; hours: number }) =>
      kind === "deadlineAlarm"
        ? updateDeadlineAlarm(hours)
        : updateTaskAlarm(hours),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}
