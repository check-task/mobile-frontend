import { useQuery } from "@tanstack/react-query";

import { getTaskDetail, taskKeys } from "../api/taskApi";
import { toTaskFormValue } from "../api/taskMapper";

/** 과제 상세를 수정 폼 초기값으로 불러온다. 상세 화면과 캐시를 공유한다 */
export function useTaskFormValueQuery(taskId: number) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => getTaskDetail(taskId),
    select: toTaskFormValue,
  });
}
