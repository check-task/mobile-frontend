import { useQuery } from "@tanstack/react-query";

import { getMyInfo, userKeys } from "@/lib/api/userApi";

export function useMyUserIdQuery() {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: getMyInfo,
    select: (data) => data.userId,
  });
}
