import { useRouter } from "expo-router";

import { VerificationCodeStep } from "./VerificationCodeStep";

export function SignupVerifyScreen() {
  const router = useRouter();

  return (
    <VerificationCodeStep
      title="이메일 인증"
      description="이메일로 전송받은 인증코드를 정확하게 입력해 주세요."
      submitLabel="인증하기"
      onResend={() => {}}
      onSubmit={() => router.push("/signup/password")}
    />
  );
}
