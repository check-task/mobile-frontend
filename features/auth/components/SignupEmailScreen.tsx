import { useRouter } from "expo-router";

import { EmailStep } from "./EmailStep";

export function SignupEmailScreen() {
  const router = useRouter();

  return (
    <EmailStep
      title="회원가입"
      description="로그인 시 사용하실 이메일을 입력해 주세요."
      onSubmit={() => router.push("/signup/verify")}
    />
  );
}
