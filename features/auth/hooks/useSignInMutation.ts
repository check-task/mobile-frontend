import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveTokens } from "@/lib/api/tokenStorage";
import { registerPushToken } from "@/lib/push/pushNotifications";

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
    onSuccess: () => {
      queryClient.clear();
      // 푸시 등록이 실패해도 로그인은 끝난 것이라 기다리지 않는다
      registerPushToken().catch((error: unknown) =>
        console.warn("푸시 토큰 등록 실패", error)
      );
    },
  });
}
