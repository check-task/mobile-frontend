import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";

import { saveTokens } from "@/lib/api/tokenStorage";
import { keyValueStorage } from "@/lib/keyValueStorage";
import { registerPushToken } from "@/lib/push/pushNotifications";

import { signInWithApple } from "../api/authApi";
import type { AppleSignInRequest } from "../api/auth.types";

type AppleUser = NonNullable<AppleSignInRequest["user"]>;

// 애플은 이름·이메일을 첫 인증 때만 준다. 서버 로그인이 실패하면 다시 받을 수 없어서,
// 애플 사용자 ID 별로 보관했다가 재시도할 때 보내고, 서버가 처리한 뒤에 지운다
const pendingUserKey = (appleUserId: string) =>
  `applePendingUser.${appleUserId}`;

async function readPendingUser(appleUserId: string) {
  try {
    const stored = await keyValueStorage.get(pendingUserKey(appleUserId));
    return stored ? (JSON.parse(stored) as AppleUser) : null;
  } catch (error) {
    console.warn("보관한 애플 사용자 정보를 읽지 못함", error);
    return null;
  }
}

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

      const { user: appleUserId, identityToken, fullName, email } = credential;
      if (!identityToken) throw new Error("Apple identityToken 이 없습니다.");

      const hasName = Boolean(fullName?.givenName || fullName?.familyName);
      let user: AppleUser | null = null;
      if (hasName || email) {
        user = {
          name: {
            firstName: fullName?.givenName ?? null,
            lastName: fullName?.familyName ?? null,
          },
          email,
        };
        await keyValueStorage
          .set(pendingUserKey(appleUserId), JSON.stringify(user))
          .catch((error: unknown) =>
            console.warn("애플 사용자 정보를 보관하지 못함", error)
          );
      } else {
        user = await readPendingUser(appleUserId);
      }

      const result = await signInWithApple({ identityToken, user });
      if (user) {
        await keyValueStorage
          .remove(pendingUserKey(appleUserId))
          .catch((error: unknown) =>
            console.warn("보관한 애플 사용자 정보를 지우지 못함", error)
          );
      }
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
