import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "@/lib/api/userApi";

import { updateFolderPriority } from "../api/settingsApi";

export function useReorderFoldersMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    // `지정안함`은 서버가 rank 0 으로 고정하고 순서 변경에서 뺀다
    mutationFn: (folderIds: number[]) =>
      updateFolderPriority({
        orderedFolders: folderIds.map((folderId, index) => ({
          folderId,
          rank: index + 1,
        })),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}
