import { login as loginWithKakaoSdk } from "@react-native-seoul/kakao-login";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveTokens } from "@/lib/api/tokenStorage";
import { registerPushToken } from "@/lib/push/pushNotifications";

import { signInWithKakao } from "../api/authApi";

export type KakaoSignInResult =
  | { status: "signedIn"; isNewUser: boolean }
  | { status: "cancelled" }
  | { status: "withdrawn"; restoreToken: string };

// SDK 는 취소도 오류로 넘기고 코드가 모두 같아서 메시지로 구분한다 (iOS: ClientFailed(Cancelled), Android: user cancelled)
function isCancelled(error: unknown) {
  return error instanceof Error && /cancel/i.test(error.message);
}

/** 카카오 SDK로 로그인하고, 받은 카카오 토큰으로 서버에 로그인한다 */
export function useKakaoSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<KakaoSignInResult> => {
      let kakaoAccessToken: string;
      try {
        ({ accessToken: kakaoAccessToken } = await loginWithKakaoSdk());
      } catch (error) {
        if (isCancelled(error)) return { status: "cancelled" };
        throw error;
      }

      const result = await signInWithKakao(kakaoAccessToken);
      if ("withdrawnUser" in result) {
        return { status: "withdrawn", restoreToken: result.restoreToken };
      }

      const { accessToken, refreshToken, isNewUser } = result;
      await saveTokens({ accessToken, refreshToken });
      return { status: "signedIn", isNewUser };
    },
    onSuccess: (result) => {
      if (result.status !== "signedIn") return;
      // 전에 다른 계정으로 불러온 데이터가 남지 않게 비운다
      queryClient.clear();
      // 푸시 등록이 실패해도 로그인은 끝난 것이라 기다리지 않는다
      registerPushToken().catch((error: unknown) =>
        console.warn("푸시 토큰 등록 실패", error)
      );
    },
  });
}
