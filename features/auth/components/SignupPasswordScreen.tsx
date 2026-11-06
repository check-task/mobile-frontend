import { useRouter } from "expo-router";

import { PasswordStep } from "./PasswordStep";

export function SignupPasswordScreen() {
  const router = useRouter();

  return (
    <PasswordStep
      description="사용하실 비밀번호를 입력하세요."
      onSubmit={() => router.push("/signup/profile")}
    />
  );
}
