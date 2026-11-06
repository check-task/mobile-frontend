import { useState } from "react";

import { Button } from "@/components/common/Button/Button";

import { AuthFormField, AuthInput } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";

type EmailStepProps = {
  title: string;
  description: string;
  // 인증코드 발송 버튼을 눌렀을 때
  onSubmit: (email: string) => void;
};

// 이메일을 입력받아 인증코드를 발송하는 단계
export function EmailStep({ title, description, onSubmit }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const trimmedEmail = email.trim();

  return (
    <AuthStepLayout
      footer={
        <Button
          label="인증코드 발송"
          disabled={trimmedEmail.length === 0}
          onPress={() => onSubmit(trimmedEmail)}
        />
      }
    >
      <AuthStepHeading title={title} description={description} />
      <AuthStepDivider />
      <AuthFormField label="이메일">
        <AuthInput
          value={email}
          onChangeText={setEmail}
          placeholder="이메일을 입력하세요."
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </AuthFormField>
    </AuthStepLayout>
  );
}
