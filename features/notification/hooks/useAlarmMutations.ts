import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  alarmKeys,
  deleteAlarm,
  deleteAllAlarms,
  readAllAlarms,
} from "../api/alarmApi";

export function useAlarmMutations() {
  const queryClient = useQueryClient();
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: alarmKeys.list() });

  return {
    // 목록은 다시 불러오지 않는다. 들어오는 순간 모두 흐려지면 어떤 알림이 새것이었는지 알 수 없다.
    readAll: useMutation({ mutationFn: readAllAlarms }),
    remove: useMutation({ mutationFn: deleteAlarm, onSuccess: refresh }),
    removeAll: useMutation({ mutationFn: deleteAllAlarms, onSuccess: refresh }),
  };
}
