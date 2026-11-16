import { Image, type ImageStyle } from "expo-image";
import { View } from "react-native";

const AVATAR_STYLE = {
  width: 100,
  height: 100,
  borderRadius: 50,
} satisfies ImageStyle;

type ProfileAvatarProps = {
  uri: string | null;
};

/** 프로필 사진. 없으면 기본 원을 보여준다. */
export function ProfileAvatar({ uri }: ProfileAvatarProps) {
  return uri ? (
    <Image
      source={{ uri }}
      style={AVATAR_STYLE}
      contentFit="cover"
      accessibilityLabel="프로필 사진"
    />
  ) : (
    <View className="size-[100px] rounded-full bg-blue-100" />
  );
}
