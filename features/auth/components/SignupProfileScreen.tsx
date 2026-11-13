import { launchImageLibraryAsync } from "expo-image-picker";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

import { AuthFormField, AuthInput, FieldMessage } from "./AuthFormField";
import {
  AuthStepDivider,
  AuthStepHeading,
  AuthStepLayout,
} from "./AuthStepLayout";
import { ProfilePhotoField } from "./ProfilePhotoField";

const PHONE_NUMBER_MAX_DIGITS = 11;
// 업로드 용량을 줄이기 위한 이미지 압축 품질 (0~1)
const PHOTO_QUALITY = 0.8;

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
  const [photoError, setPhotoError] = useState(false);
  // 연속 클릭 작업 꼬임 방지 (늦게 끝난 이전 요청 무시)
  const latestPhotoRequestRef = useRef(0);

  // 라이브러리에서 사진 골라 정사각형으로 크롭 (따로 권한 요청 안 해도 됨)
  const pickPhoto = async () => {
    const requestId = ++latestPhotoRequestRef.current;
    setPhotoError(false);
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: PHOTO_QUALITY,
      });
      if (requestId !== latestPhotoRequestRef.current) return;
      const asset = result.canceled ? undefined : result.assets[0];
      if (asset) setPhotoUri(asset.uri);
    } catch {
      if (requestId === latestPhotoRequestRef.current) setPhotoError(true);
    }
  };

  const removePhoto = () => {
    latestPhotoRequestRef.current += 1;
    setPhotoError(false);
    setPhotoUri(null);
  };

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
        <AuthFormField
          label="프로필 사진"
          message={
            photoError ? (
              <FieldMessage tone="error">
                사진을 불러오지 못했습니다. 다시 시도해 주세요.
              </FieldMessage>
            ) : null
          }
        >
          <ProfilePhotoField
            photoUri={photoUri}
            onUpload={pickPhoto}
            onChange={pickPhoto}
            onRemove={removePhoto}
          />
        </AuthFormField>
      </View>
    </AuthStepLayout>
  );
}
