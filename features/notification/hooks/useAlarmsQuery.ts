import { useInfiniteQuery } from "@tanstack/react-query";

import { alarmKeys, getAlarms } from "../api/alarmApi";

export function useAlarmsQuery() {
  return useInfiniteQuery({
    queryKey: alarmKeys.list(),
    queryFn: ({ pageParam }) => getAlarms(pageParam),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.cursor : null,
    select: (data) => data.pages.flatMap((page) => page.alarmList),
  });
}
