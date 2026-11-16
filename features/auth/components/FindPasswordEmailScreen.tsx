import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";

import { getAuthErrorMessage } from "../api/authErrorMessage";
import { usePasswordResetDraft } from "../hooks/usePasswordResetDraft";
import { useSendPasswordResetCodeMutation } from "../hooks/useSendPasswordResetCodeMutation";

import { EmailStep } from "./EmailStep";

export function FindPasswordEmailScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const setEmail = usePasswordResetDraft((state) => state.setEmail);
  const resetDraft = usePasswordResetDraft((state) => state.reset);
  const markCodeSent = usePasswordResetDraft((state) => state.markCodeSent);
  const sendCodeMutation = useSendPasswordResetCodeMutation();

  // 새로 시작할 때 지난번 값을 비운다 (회원가입과 같은 이유로 완료 직후가 아니라 여기서)
  useEffect(() => {
    resetDraft();
  }, [resetDraft]);

  const submit = (email: string) => {
    sendCodeMutation.mutate(email, {
      onSuccess: () => {
        setEmail(email);
        markCodeSent();
        router.push("/find-password/verify");
      },
      onError: (error) =>
        showToast(
          "fail",
          getAuthErrorMessage(error, "인증코드를 보내지 못했어요.")
        ),
    });
  };

  return (
    <EmailStep
      title="비밀번호 찾기"
      description="가입하신 이메일을 입력하세요."
      onSubmit={submit}
      isSubmitting={sendCodeMutation.isPending}
    />
  );
}
