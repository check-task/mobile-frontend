import {
  type ImagePickerAsset,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { useToast } from "@/hooks/useToast";

import type { SignUpRequest } from "../api/auth.types";
import { getAuthErrorMessage } from "../api/authErrorMessage";
import { useSignUpMutation } from "../hooks/useSignUpMutation";
import { useSignupDraft } from "../hooks/useSignupDraft";

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

// web 은 File 객체, native 는 uri 파트로 보낸다
function toProfileImage(
  asset: ImagePickerAsset
): SignUpRequest["profileImage"] {
  if (Platform.OS === "web" && asset.file) return asset.file;
  return {
    uri: asset.uri,
    name: asset.fileName ?? "profile.jpg",
    type: asset.mimeType ?? "image/jpeg",
  };
}

export function SignupProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const { email, password } = useSignupDraft();
  const signUpMutation = useSignUpMutation();
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);
  const [photoError, setPhotoError] = useState(false);

  // 웹 새로고침 등으로 앞 단계 값이 없으면 처음 단계로
  useEffect(() => {
    if (!email || !password) router.replace("/signup");
  }, [email, password, router]);
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
      if (asset) setPhoto(asset);
    } catch {
      if (requestId === latestPhotoRequestRef.current) setPhotoError(true);
    }
  };

  const removePhoto = () => {
    latestPhotoRequestRef.current += 1;
    setPhotoError(false);
    setPhoto(null);
  };

  const handleSubmit = () => {
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    signUpMutation.mutate(
      {
        email,
        password,
        nickname: nickname.trim(),
        ...(phoneDigits && { phoneNum: phoneDigits }),
        ...(photo && { profileImage: toProfileImage(photo) }),
      },
      {
        onSuccess: () => {
          showToast("success", "회원가입이 완료되었어요.");
          router.dismissTo("/login");
        },
        onError: (error) =>
          showToast(
            "fail",
            getAuthErrorMessage(error, "회원가입하지 못했어요.")
          ),
      }
    );
  };

  return (
    <AuthStepLayout
      footer={
        <Button
          label="회원가입"
          disabled={nickname.trim().length === 0 || signUpMutation.isPending}
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
            photoUri={photo?.uri ?? null}
            onUpload={pickPhoto}
            onChange={pickPhoto}
            onRemove={removePhoto}
          />
        </AuthFormField>
      </View>
    </AuthStepLayout>
  );
}
