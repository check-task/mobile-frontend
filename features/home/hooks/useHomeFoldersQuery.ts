import { useQuery } from "@tanstack/react-query";

import { getMyInfo, userKeys } from "@/lib/api/userApi";

import { toHomeFolders } from "../api/homeMapper";

export function useHomeFoldersQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    select: (data) => toHomeFolders(data.folders),
  });
}
