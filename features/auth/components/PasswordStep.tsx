import { useState } from "react";

import { Button } from "@/components/common/Button/Button";
import { PasswordCriteria } from "@/components/common/PasswordCriteria/PasswordCriteria";
import { isValidPassword } from "@/lib/password";

import { AuthFormField, AuthInput } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";

type PasswordStepProps = {
  description: string;
  onSubmit: (password: string) => void;
  //저장 요청 중이면 버튼을 막는다
  isSubmitting?: boolean;
};

//비밀번호 입력 단계
export function PasswordStep({
  description,
  onSubmit,
  isSubmitting = false,
}: PasswordStepProps) {
  const [password, setPassword] = useState("");

  return (
    <AuthStepLayout
      footer={
        <Button
          label="다음"
          disabled={!isValidPassword(password) || isSubmitting}
          onPress={() => onSubmit(password)}
        />
      }
    >
      <AuthStepHeading title="비밀번호 설정" description={description} />
      <AuthStepDivider />
      <AuthFormField
        label="비밀번호"
        message={<PasswordCriteria password={password} />}
      >
        <AuthInput
          shape="box-password"
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호를 입력하세요."
          autoCapitalize="none"
          autoComplete="new-password"
        />
      </AuthFormField>
    </AuthStepLayout>
  );
}
