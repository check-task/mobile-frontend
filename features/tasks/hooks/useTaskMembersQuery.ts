import { useQuery } from "@tanstack/react-query";

import { getTaskMembers, taskKeys } from "../api/taskApi";

export function useTaskMembersQuery(taskId: number) {
  return useQuery({
    queryKey: taskKeys.members(taskId),
    queryFn: () => getTaskMembers(taskId),
    select: (data) => data.members,
  });
}
