import { useQuery } from "@tanstack/react-query";

import { getMyInfo, userKeys } from "@/lib/api/userApi";

import { toFolderOptions } from "../api/taskMapper";

export function useMyFoldersQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    select: (data) => toFolderOptions(data.folders),
  });
}
