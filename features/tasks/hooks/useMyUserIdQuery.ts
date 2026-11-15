import { useQuery } from "@tanstack/react-query";

import { getMyInfo, taskKeys } from "../api/taskApi";

export function useMyUserIdQuery() {
  return useQuery({
    queryKey: taskKeys.myInfo(),
    queryFn: getMyInfo,
    select: (data) => data.userId,
  });
}
