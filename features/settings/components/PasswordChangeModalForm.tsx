import type { ReactNode } from "react";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { PasswordCriteria } from "@/components/common/PasswordCriteria/PasswordCriteria";
import { isValidPassword } from "@/lib/password";

type PasswordChangeModalFormProps = {
  onSubmit: (currentPassword: string, newPassword: string) => void;
};

// 기존 비밀번호 일치 여부(`비밀번호가 일치합니다.`)는 서버 확인이 필요해 API 연동 때 붙인다.
export function PasswordChangeModalForm({
  onSubmit,
}: PasswordChangeModalFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isMismatch =
    confirmPassword.length > 0 && confirmPassword !== newPassword;
  const canSave =
    currentPassword.length > 0 &&
    isValidPassword(newPassword) &&
    confirmPassword === newPassword;

  return (
    <View className="gap-6 pb-5 pt-5">
      <View className="gap-4">
        <Field label="기존 비밀번호">
          <Input
            shape="modal-password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="기존 비밀번호를 입력하세요."
            autoCapitalize="none"
          />
        </Field>
        <Field label="새 비밀번호">
          <Input
            shape="modal-password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="새 비밀번호를 입력하세요."
            autoCapitalize="none"
          />
          <PasswordCriteria password={newPassword} />
        </Field>
        <Field label="비밀번호 확인">
          <Input
            shape="modal-password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="새 비밀번호를 한 번 더 입력하세요."
            autoCapitalize="none"
          />
          {isMismatch ? (
            <Text className="text-sub-01 text-b-04-r">
              비밀번호가 일치하지 않습니다.
            </Text>
          ) : null}
        </Field>
      </View>
      <Button
        label="변경사항 저장"
        size="modal"
        disabled={!canSave}
        onPress={() => onSubmit(currentPassword, newPassword)}
      />
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text className="mb-1 text-gray-900 text-b-02-r">{label}</Text>
      {children}
    </View>
  );
}
