import { useQuery } from "@tanstack/react-query";

import { getCompletedTasks, taskKeys } from "../api/taskApi";
import { toCompletedTaskListItem } from "../api/taskMapper";

export function useCompletedTasksQuery() {
  const query = useQuery({
    queryKey: taskKeys.completed(),
    queryFn: getCompletedTasks,
    select: (data) => data.tasks.map(toCompletedTaskListItem),
  });
  return {
    tasks: query.data ?? [],
    isPending: query.isPending,
    isError: query.isError,
  };
}
