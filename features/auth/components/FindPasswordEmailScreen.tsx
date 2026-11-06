import { useRouter } from "expo-router";

import { EmailStep } from "./EmailStep";

export function FindPasswordEmailScreen() {
  const router = useRouter();

  return (
    <EmailStep
      title="비밀번호 찾기"
      description="가입하신 이메일을 입력하세요."
      onSubmit={() => router.push("/find-password/verify")}
    />
  );
}
