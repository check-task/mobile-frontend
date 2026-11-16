import { useQuery } from "@tanstack/react-query";

import { getMyInfo, taskKeys } from "../api/taskApi";
import { toTaskFolders } from "../api/taskMapper";

/** 목록 화면 폴더 필터용 내 폴더 */
export function useTaskFoldersQuery() {
  return useQuery({
    queryKey: taskKeys.myInfo(),
    queryFn: getMyInfo,
    select: (data) => toTaskFolders(data.folders),
  });
}
