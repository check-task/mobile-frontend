import { useRouter } from "expo-router";
import { useEffect } from "react";

import { useSignupDraft } from "../hooks/useSignupDraft";

import { PasswordStep } from "./PasswordStep";

export function SignupPasswordScreen() {
  const router = useRouter();
  const email = useSignupDraft((state) => state.email);
  const setPassword = useSignupDraft((state) => state.setPassword);

  // 웹 새로고침 등으로 이메일이 없으면 처음 단계로
  useEffect(() => {
    if (!email) router.replace("/signup");
  }, [email, router]);

  return (
    <PasswordStep
      description="사용하실 비밀번호를 입력하세요."
      onSubmit={(password) => {
        setPassword(password);
        router.push("/signup/profile");
      }}
    />
  );
}
