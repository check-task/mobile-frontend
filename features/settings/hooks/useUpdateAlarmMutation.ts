import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "@/lib/api/userApi";

import { updateDeadlineAlarm, updateTaskAlarm } from "../api/settingsApi";

export type AlarmKind = "deadlineAlarm" | "taskAlarm";

export function useUpdateAlarmMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    // 연달아 바꿔도 마지막 값이 서버에 남도록 순서대로 보낸다
    scope: { id: "alarm-settings" },
    mutationFn: ({ kind, hours }: { kind: AlarmKind; hours: number }) =>
      kind === "deadlineAlarm"
        ? updateDeadlineAlarm(hours)
        : updateTaskAlarm(hours),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}
