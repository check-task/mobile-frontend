import { useQueries } from "@tanstack/react-query";

import { getTasks, taskKeys } from "../api/taskApi";
import { toTaskListItem } from "../api/taskMapper";

// 탭마다 과제 수를 보여줘야 해서 개인·팀을 같이 불러온다
export function useOngoingTasksQuery() {
  return useQueries({
    queries: (["PERSONAL", "TEAM"] as const).map((type) => ({
      queryKey: taskKeys.list(type),
      queryFn: () => getTasks(type),
    })),
    combine: (results) => ({
      tasks: results.flatMap((result) =>
        (result.data?.task ?? []).map(toTaskListItem)
      ),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
    }),
  });
}
