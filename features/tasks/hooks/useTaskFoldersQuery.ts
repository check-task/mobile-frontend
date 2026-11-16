import { useQuery } from "@tanstack/react-query";

import { getMyInfo, userKeys } from "@/lib/api/userApi";

import { toTaskFolders } from "../api/taskMapper";

/** 목록 화면 폴더 필터용 내 폴더 */
export function useTaskFoldersQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    select: (data) => toTaskFolders(data.folders),
  });
}
