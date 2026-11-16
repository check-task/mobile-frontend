import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "../api/settingsApi";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    // 닉네임·사진은 팀원·댓글 등 다른 feature 쿼리에도 들어 있어 전부 다시 조회한다
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
