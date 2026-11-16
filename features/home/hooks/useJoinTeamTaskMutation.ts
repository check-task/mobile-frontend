import { useMutation, useQueryClient } from "@tanstack/react-query";

import { homeKeys, joinTeamTask } from "../api/homeApi";

export function useJoinTeamTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinTeamTask,
    // 홈 목록뿐 아니라 내 과제 목록(["task", "myList", ...])도 같이 갱신되게 과제 전체를 다시 불러온다
    onSuccess: () => queryClient.invalidateQueries({ queryKey: homeKeys.all }),
  });
}
