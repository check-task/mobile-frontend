import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateFolder } from "../api/settingsApi";
import type { FolderRequest } from "../api/settings.types";

export function useUpdateFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, ...body }: FolderRequest & { folderId: number }) =>
      updateFolder(folderId, body),
    // 폴더 이름·색은 홈·과제 목록 등 다른 feature 쿼리에도 들어 있어 전부 다시 조회한다
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
