import { useQuery } from "@tanstack/react-query";

import { getTaskDetail, taskKeys } from "../api/taskApi";
import { toTaskDetail } from "../api/taskMapper";

export function useTaskDetailQuery(taskId: number) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTaskDetail(taskId),
    select: toTaskDetail,
  });
}
