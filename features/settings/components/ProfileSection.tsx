import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

import { ProfileAvatar } from "./ProfileAvatar";

type ProfileSectionProps = {
  nickname: string;
  profileImage: string | null;
  /** 없으면 `비밀번호 변경` 버튼을 숨긴다 (카카오 유저) */
  onPasswordPress?: () => void;
  onProfileEditPress: () => void;
};

export function ProfileSection({
  nickname,
  profileImage,
  onPasswordPress,
  onProfileEditPress,
}: ProfileSectionProps) {
  return (
    <View className="items-center gap-5">
      <View className="items-center gap-4">
        <ProfileAvatar uri={profileImage} />
        <Text className="text-gray-700 text-b-01-m">{nickname}</Text>
      </View>
      <View className="flex-row gap-2">
        {onPasswordPress ? (
          <Button
            label="비밀번호 변경"
            variant="outline"
            size="tiny"
            onPress={onPasswordPress}
          />
        ) : null}
        <Button
          label="내 정보 수정"
          variant="outline"
          size="tiny"
          onPress={onProfileEditPress}
        />
      </View>
    </View>
  );
}
