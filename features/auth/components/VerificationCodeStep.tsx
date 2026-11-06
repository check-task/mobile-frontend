import { useState } from "react";

import { Button } from "@/components/common/Button/Button";

import { useCountdown } from "../hooks/useCountdown";
import { AuthFormField, AuthInput, FieldMessage } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";

const CODE_VALID_SECONDS = 120;

export type VerificationStatus = "idle" | "mismatch" | "match";

type VerificationCodeStepProps = {
  title: string;
  description: string;
  submitLabel: string;
  //인증코드 확인 결과
  status?: VerificationStatus;
  //넘기면 인증코드 재발송 버튼을 보여줌.
  onResend?: () => void;
  onSubmit: (code: string) => void;
};

// 이메일로 받은 인증코드를 입력하는 단계
export function VerificationCodeStep({
  title,
  description,
  submitLabel,
  status = "idle",
  onResend,
  onSubmit,
}: VerificationCodeStepProps) {
  const [code, setCode] = useState("");
  const countdown = useCountdown(CODE_VALID_SECONDS);
  const trimmedCode = code.trim();
  const canSubmit =
    trimmedCode.length > 0 && status !== "mismatch" && !countdown.isExpired;

  const handleResend = () => {
    countdown.restart();
    onResend?.();
  };

  return (
    <AuthStepLayout
      footer={
        <>
          {onResend ? (
            <Button
              label="인증코드 재발송"
              variant="gray"
              onPress={handleResend}
            />
          ) : null}
          <Button
            label={submitLabel}
            disabled={!canSubmit}
            onPress={() => onSubmit(trimmedCode)}
          />
        </>
      }
    >
      <AuthStepHeading title={title} description={description} />
      <AuthStepDivider />
      <AuthFormField
        label="인증코드"
        message={
          status === "mismatch" ? (
            <FieldMessage tone="error">
              인증코드를 정확하게 입력해 주세요.
            </FieldMessage>
          ) : status === "match" ? (
            <FieldMessage tone="success">인증코드가 일치합니다.</FieldMessage>
          ) : null
        }
      >
        <AuthInput
          shape="box-timer"
          timerLabel={countdown.label}
          value={code}
          onChangeText={setCode}
          placeholder="인증코드를 입력하세요."
          autoCapitalize="characters"
          autoComplete="one-time-code"
        />
      </AuthFormField>
    </AuthStepLayout>
  );
}
