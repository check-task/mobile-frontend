import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import { getAuthErrorMessage } from "../api/authErrorMessage";
import { useConfirmPasswordResetMutation } from "../hooks/useConfirmPasswordResetMutation";
import { usePasswordResetDraft } from "../hooks/usePasswordResetDraft";

import { PasswordStep } from "./PasswordStep";

export function FindPasswordResetScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const resetToken = usePasswordResetDraft((state) => state.resetToken);
  const confirmMutation = useConfirmPasswordResetMutation();

  // 웹 새로고침 등으로 토큰이 없으면 처음 단계로
  useEffect(() => {
    if (!resetToken) router.replace("/find-password");
  }, [resetToken, router]);

  const submit = (newPassword: string) => {
    confirmMutation.mutate(
      { resetToken, newPassword },
      {
        onSuccess: () => router.replace("/find-password/complete"),
        onError: (error) => {
          showToast(
            "fail",
            getAuthErrorMessage(error, "비밀번호를 바꾸지 못했어요.")
          );
          // 토큰이 만료(10분)됐거나 이미 썼으면 인증부터 다시 해야 한다
          if (
            error instanceof ApiError &&
            error.errorCode === "INVALID_TOKEN"
          ) {
            router.dismissTo("/find-password");
          }
        },
      }
    );
  };

  return (
    <PasswordStep
      description="사용하실 새로운 비밀번호를 입력하세요."
      onSubmit={submit}
      isSubmitting={confirmMutation.isPending}
    />
  );
}
