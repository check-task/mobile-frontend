import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import { getAuthErrorMessage } from "../api/authErrorMessage";
import { usePasswordResetDraft } from "../hooks/usePasswordResetDraft";
import { useSendPasswordResetCodeMutation } from "../hooks/useSendPasswordResetCodeMutation";
import { useVerifyPasswordResetCodeMutation } from "../hooks/useVerifyPasswordResetCodeMutation";

import {
  VerificationCodeStep,
  type VerificationStatus,
} from "./VerificationCodeStep";

const RESEND_COOLDOWN_MS = 2 * 60 * 1000;

export function FindPasswordVerifyScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const email = usePasswordResetDraft((state) => state.email);
  const setResetToken = usePasswordResetDraft((state) => state.setResetToken);
  const codeSentAt = usePasswordResetDraft((state) => state.codeSentAt);
  const markCodeSent = usePasswordResetDraft((state) => state.markCodeSent);
  const verifyMutation = useVerifyPasswordResetCodeMutation();
  const resendMutation = useSendPasswordResetCodeMutation();
  const [status, setStatus] = useState<VerificationStatus>("idle");

  // 웹 새로고침 등으로 이메일이 없으면 처음 단계로
  useEffect(() => {
    if (!email) router.replace("/find-password");
  }, [email, router]);

  const submit = (code: string) => {
    verifyMutation.mutate(
      { email, code },
      {
        onSuccess: ({ resetToken }) => {
          setStatus("match");
          setResetToken(resetToken);
          router.push("/find-password/reset");
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

  // 재발송 API 가 따로 없어서 발송 API 를 다시 부른다.
  // 서버는 2분 안의 재발송을 200 으로 받고 메일은 안 보내서, 그 안에는 타이머도 그대로 두고 안내만 한다
  const resend = () => {
    if (Date.now() - codeSentAt < RESEND_COOLDOWN_MS) {
      showToast("fail", "인증코드는 2분 뒤에 다시 보낼 수 있어요.");
      return false;
    }
    setStatus("idle");
    resendMutation.mutate(email, {
      onSuccess: markCodeSent,
      onError: (error) =>
        showToast(
          "fail",
          getAuthErrorMessage(error, "인증코드를 다시 보내지 못했어요.")
        ),
    });
  };

  return (
    <VerificationCodeStep
      title="인증코드 입력"
      description="이메일로 전송된 인증코드를 입력하세요."
      submitLabel="다음"
      status={status}
      onResend={resend}
      onSubmit={submit}
      onCodeChange={() => setStatus("idle")}
      isSubmitting={verifyMutation.isPending}
    />
  );
}
