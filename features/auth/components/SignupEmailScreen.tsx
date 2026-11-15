import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import { getAuthErrorMessage } from "../api/authErrorMessage";
import { useSendSignupCodeMutation } from "../hooks/useSendSignupCodeMutation";
import { useSignupDraft } from "../hooks/useSignupDraft";

import { EmailStep } from "./EmailStep";

export function SignupEmailScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const setEmail = useSignupDraft((state) => state.setEmail);
  const resetDraft = useSignupDraft((state) => state.reset);
  const sendCodeMutation = useSendSignupCodeMutation();

  // 회원가입을 새로 시작할 때 지난번 값을 비운다.
  // 가입 완료 직후에 비우면 아직 떠 있는 단계 화면들이 /signup 으로 튕겨서 여기서 비운다
  useEffect(() => {
    resetDraft();
  }, [resetDraft]);

  const submit = (email: string) => {
    const goToVerify = () => {
      setEmail(email);
      router.push("/signup/verify");
    };
    sendCodeMutation.mutate(email, {
      onSuccess: goToVerify,
      onError: (error) => {
        showToast(
          "fail",
          getAuthErrorMessage(error, "인증코드를 보내지 못했어요.")
        );
        // 2분 안에 이미 보낸 코드가 있으면 그 코드로 인증하면 된다
        if (
          error instanceof ApiError &&
          error.errorCode === "CODE_ALREADY_SENT"
        ) {
          goToVerify();
        }
      },
    });
  };

  return (
    <EmailStep
      title="회원가입"
      description="로그인 시 사용하실 이메일을 입력해 주세요."
      onSubmit={submit}
      isSubmitting={sendCodeMutation.isPending}
    />
  );
}
