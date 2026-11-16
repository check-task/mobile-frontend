import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

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
  const latestCodeRef = useRef("");

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
            // 확인하는 동안 코드를 고쳤으면 새 코드에 불일치를 띄우지 않는다
            if (latestCodeRef.current === code) setStatus("mismatch");
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

  // 발송에 성공했을 때만 true 를 돌려줘서 그때만 타이머를 다시 시작한다
  const resend = async () => {
    if (resendMutation.isPending) return false;
    try {
      await resendMutation.mutateAsync(email);
      setStatus("idle");
      return true;
    } catch (error) {
      showToast(
        "fail",
        getAuthErrorMessage(error, "인증코드를 다시 보내지 못했어요.")
      );
      return false;
    }
  };

  return (
    <VerificationCodeStep
      title="이메일 인증"
      description="이메일로 전송받은 인증코드를 정확하게 입력해 주세요."
      submitLabel="인증하기"
      status={status}
      onResend={resend}
      onSubmit={submit}
      onCodeChange={(code) => {
        latestCodeRef.current = code.trim();
        setStatus("idle");
      }}
      isSubmitting={verifyMutation.isPending}
    />
  );
}
