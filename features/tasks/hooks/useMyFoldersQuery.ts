import { useQuery } from "@tanstack/react-query";

import { getMyInfo, taskKeys } from "../api/taskApi";
import { toFolderOptions } from "../api/taskMapper";

export function useMyFoldersQuery() {
  return useQuery({
    queryKey: taskKeys.myInfo(),
    queryFn: getMyInfo,
    select: (data) => toFolderOptions(data.folders),
  });
}
