import { useState } from "react";

import { Button } from "@/components/common/Button/Button";

import { AuthFormField, AuthInput } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";
import { isValidPassword, PasswordCriteria } from "./PasswordCriteria";

type PasswordStepProps = {
  description: string;
  onSubmit: (password: string) => void;
};

//비밀번호 입력 단계
export function PasswordStep({ description, onSubmit }: PasswordStepProps) {
  const [password, setPassword] = useState("");

  return (
    <AuthStepLayout
      footer={
        <Button
          label="다음"
          disabled={!isValidPassword(password)}
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
