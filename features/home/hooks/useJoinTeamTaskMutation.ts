import { useMutation, useQueryClient } from "@tanstack/react-query";

import { homeKeys, joinTeamTask } from "../api/homeApi";

export function useJoinTeamTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinTeamTask,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: homeKeys.lists() }),
  });
}
