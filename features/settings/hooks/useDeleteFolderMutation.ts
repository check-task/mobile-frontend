import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFolder } from "../api/settingsApi";

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    // 안의 과제가 `지정안함`으로 옮겨져 다른 feature 쿼리도 전부 다시 조회한다
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
