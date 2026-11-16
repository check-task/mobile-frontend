import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTasks, homeKeys } from "../api/homeApi";
import { toHomeTasks } from "../api/homeMapper";
import type { HomeSort } from "../api/home.types";

// 마감일 변경을 낙관적으로 반영하려고 캐시에 화면 타입을 둔다 (select 대신 queryFn 에서 변환)
export function useHomeTasksQuery(sort: HomeSort) {
  return useQuery({
    queryKey: homeKeys.list({ sort }),
    queryFn: async () => toHomeTasks(await getTasks({ sort })),
    // 정렬을 바꿀 때 캘린더가 비지 않게 이전 결과를 유지한다
    placeholderData: keepPreviousData,
  });
}
