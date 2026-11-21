import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";

import { saveTokens } from "@/lib/api/tokenStorage";
import { registerPushToken } from "@/lib/push/pushNotifications";

import { signInWithApple } from "../api/authApi";

export type AppleSignInResult =
  | { status: "signedIn"; isNewUser: boolean }
  | { status: "cancelled" }
  | { status: "withdrawn"; restoreToken: string };

function isCancelled(error: unknown) {
  return (
    error instanceof Error &&
    "code" in error &&
    error.code === "ERR_REQUEST_CANCELED"
  );
}

/** 이 기기에서 애플 로그인을 쓸 수 있는지. iOS 에서만 true 가 된다 */
export function useAppleSignInAvailable() {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let active = true;
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (active) setIsAvailable(available);
      })
      .catch(() => {
        if (active) setIsAvailable(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return isAvailable;
}

/** 애플 로그인으로 identityToken 을 받고, 그 토큰으로 서버에 로그인한다 */
export function useAppleSignInMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (): Promise<AppleSignInResult> => {
      let credential: AppleAuthentication.AppleAuthenticationCredential;
      try {
        credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
      } catch (error) {
        if (isCancelled(error)) return { status: "cancelled" };
        throw error;
      }

      const { identityToken, fullName, email } = credential;
      if (!identityToken) throw new Error("Apple identityToken 이 없습니다.");

      const hasName = Boolean(fullName?.givenName || fullName?.familyName);
      const result = await signInWithApple({
        identityToken,
        user:
          hasName || email
            ? {
                name: {
                  firstName: fullName?.givenName ?? null,
                  lastName: fullName?.familyName ?? null,
                },
                email,
              }
            : null,
      });
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
