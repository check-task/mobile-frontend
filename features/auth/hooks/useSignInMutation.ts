import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveTokens } from "@/lib/api/tokenStorage";

import { signIn } from "../api/authApi";
import type { SignInRequest } from "../api/auth.types";

export function useSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: SignInRequest) => {
      const { accessToken, refreshToken } = await signIn(body);
      await saveTokens({ accessToken, refreshToken });
    },
    // 전에 다른 계정으로 불러온 데이터가 남지 않게 비운다
    onSuccess: () => queryClient.clear(),
  });
}
