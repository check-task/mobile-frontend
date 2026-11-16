import { launchImageLibraryAsync } from "expo-image-picker";
import type { ReactNode } from "react";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Cancel, Swap } from "@/components/icons";

import { ProfileAvatar } from "./ProfileAvatar";
import type { SettingsProfile } from "./settingsData";

type ProfileEditModalFormProps = {
  initialProfile: SettingsProfile;
  onSubmit: (profile: SettingsProfile) => void;
};

export function ProfileEditModalForm({
  initialProfile,
  onSubmit,
}: ProfileEditModalFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [photoError, setPhotoError] = useState(false);
  const update = (patch: Partial<SettingsProfile>) =>
    setProfile((prev) => ({ ...prev, ...patch }));

  const isChanged =
    profile.nickname !== initialProfile.nickname ||
    profile.phoneNum !== initialProfile.phoneNum ||
    profile.email !== initialProfile.email ||
    profile.profileImage !== initialProfile.profileImage;
  const canSave = isChanged && profile.nickname.trim() !== "";

  // 실패하면 기존 사진은 그대로 두고 문구로 알린다 (토스트는 모달 아래에 깔린다)
  const pickPhoto = async () => {
    setPhotoError(false);
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
      });
      const asset = result.canceled ? undefined : result.assets[0];
      if (asset) update({ profileImage: asset.uri });
    } catch {
      setPhotoError(true);
    }
  };

  return (
    <View className="gap-6 pb-5 pt-5">
      <View className="gap-4">
        <View className="items-center gap-3">
          <ProfileAvatar uri={profile.profileImage} />
          <View className="flex-row gap-2">
            <PhotoActionButton
              label="사진변경"
              icon={<Swap variant="sm" className="text-gray-400" />}
              onPress={pickPhoto}
            />
            <PhotoActionButton
              label="사진삭제"
              icon={<Cancel variant="sm" className="text-gray-400" />}
              onPress={() => update({ profileImage: null })}
            />
          </View>
          {photoError ? (
            <Text className="text-sub-01 text-b-04-r">
              사진을 불러오지 못했어요. 다시 시도해 주세요.
            </Text>
          ) : null}
        </View>
        <View className="mx-3 h-px bg-gray-200" />
        <Field label="닉네임">
          <Input
            shape="modal"
            value={profile.nickname}
            onChangeText={(nickname) => update({ nickname })}
            placeholder="닉네임"
          />
        </Field>
        <Field label="연락처">
          <Input
            shape="modal"
            value={profile.phoneNum}
            onChangeText={(phoneNum) => update({ phoneNum })}
            placeholder="010-0000-0000"
            keyboardType="phone-pad"
          />
        </Field>
        <Field label="이메일">
          <Input
            shape="modal"
            value={profile.email}
            onChangeText={(email) => update({ email })}
            placeholder="checktask@ct.kr"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>
      </View>
      <Button
        label="변경사항 저장"
        size="modal"
        disabled={!canSave}
        onPress={() =>
          onSubmit({ ...profile, nickname: profile.nickname.trim() })
        }
      />
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-gray-900 text-b-02-r">{label}</Text>
      {children}
    </View>
  );
}

type PhotoActionButtonProps = {
  label: string;
  icon: ReactNode;
  onPress: () => void;
};

function PhotoActionButton({ label, icon, onPress }: PhotoActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      className="flex-row items-start border-b border-gray-200 pb-0.5"
    >
      <Text className="text-gray-400 text-b-04-r">{label}</Text>
      {icon}
    </Pressable>
  );
}
