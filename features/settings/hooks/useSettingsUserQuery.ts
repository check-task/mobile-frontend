import { useQuery } from "@tanstack/react-query";

import { getMyInfo, userKeys } from "@/lib/api/userApi";

import { toSettingsUser } from "../api/settingsMapper";

export function useSettingsUserQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    select: toSettingsUser,
  });
}
