import { useRouter } from "expo-router";

import { PasswordStep } from "./PasswordStep";

export function FindPasswordResetScreen() {
  const router = useRouter();

  return (
    <PasswordStep
      description="사용하실 새로운 비밀번호를 입력하세요."
      onSubmit={() => router.replace("/find-password/complete")}
    />
  );
}
