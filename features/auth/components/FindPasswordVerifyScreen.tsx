import { useRouter } from "expo-router";

import { VerificationCodeStep } from "./VerificationCodeStep";

export function FindPasswordVerifyScreen() {
  const router = useRouter();

  return (
    <VerificationCodeStep
      title="인증코드 입력"
      description="이메일로 전송된 인증코드를 입력하세요."
      submitLabel="다음"
      onSubmit={() => router.push("/find-password/reset")}
    />
  );
}
