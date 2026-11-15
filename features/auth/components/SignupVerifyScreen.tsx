import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import { getAuthErrorMessage } from "../api/authErrorMessage";
import { useResendEmailCodeMutation } from "../hooks/useResendEmailCodeMutation";
import { useSignupDraft } from "../hooks/useSignupDraft";
import { useVerifyEmailCodeMutation } from "../hooks/useVerifyEmailCodeMutation";

import {
  VerificationCodeStep,
  type VerificationStatus,
} from "./VerificationCodeStep";

export function SignupVerifyScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const email = useSignupDraft((state) => state.email);
  const verifyMutation = useVerifyEmailCodeMutation();
  const resendMutation = useResendEmailCodeMutation();
  const [status, setStatus] = useState<VerificationStatus>("idle");

  // 웹 새로고침 등으로 이메일이 없으면 처음 단계로
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  const submit = (code: string) => {
    verifyMutation.mutate(
      { email, code },
      {
        onSuccess: () => {
          setStatus("match");
          router.push("/signup/password");
        },
        onError: (error) => {
          if (error instanceof ApiError && error.errorCode === "INVALID_CODE") {
            setStatus("mismatch");
            return;
          }
          showToast(
            "fail",
            getAuthErrorMessage(error, "인증코드를 확인하지 못했어요.")
          );
        },
      }
    );
  };

  const resend = () => {
    setStatus("idle");
    resendMutation.mutate(email, {
      onError: (error) =>
        showToast(
          "fail",
          getAuthErrorMessage(error, "인증코드를 다시 보내지 못했어요.")
        ),
    });
  };

  return (
    <VerificationCodeStep
      title="이메일 인증"
      description="이메일로 전송받은 인증코드를 정확하게 입력해 주세요."
      submitLabel="인증하기"
      status={status}
      onResend={resend}
      onSubmit={submit}
      onCodeChange={() => setStatus("idle")}
      isSubmitting={verifyMutation.isPending}
    />
  );
}
