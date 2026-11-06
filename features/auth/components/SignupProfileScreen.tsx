import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

import { AuthFormField, AuthInput } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";
import { ProfilePhotoField } from "./ProfilePhotoField";

const PHONE_NUMBER_MAX_DIGITS = 11;

// 숫자만 남기고 010-0000-0000 형태
function formatPhoneNumber(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, PHONE_NUMBER_MAX_DIGITS);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export function SignupProfileScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const handleSubmit = () => {
    router.dismissTo("/login");
  };

  return (
    <AuthStepLayout
      footer={
        <Button
          label="회원가입"
          disabled={nickname.trim().length === 0}
          onPress={handleSubmit}
        />
      }
    >
      <AuthStepHeading
        title="프로필 설정"
        description="사용하실 프로필을 설정해 주세요."
      />
      <AuthStepDivider />
      <View className="gap-7 pb-7">
        <AuthFormField
          label="닉네임"
          required
          message={
            <Text className="text-primary text-b-03-r">필수항목입니다.</Text>
          }
        >
          <AuthInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="닉네임을 입력하세요."
          />
        </AuthFormField>
        <AuthFormField label="전화번호">
          <AuthInput
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </AuthFormField>
        <AuthFormField label="프로필 사진">
          <ProfilePhotoField
            photoUri={photoUri}
            onRemove={() => setPhotoUri(null)}
          />
        </AuthFormField>
      </View>
    </AuthStepLayout>
  );
}
