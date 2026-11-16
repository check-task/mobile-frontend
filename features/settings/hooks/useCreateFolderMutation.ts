import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userKeys } from "@/lib/api/userApi";

import { createFolder } from "../api/settingsApi";

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    // 다시 조회한 뒤에 끝나야 모달을 닫을 때 새 폴더가 보인다
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userKeys.me() }),
  });
}
