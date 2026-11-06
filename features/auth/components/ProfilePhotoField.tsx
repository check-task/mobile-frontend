import { Image } from "expo-image";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Cancel, Folder, Swap } from "@/components/icons";

type ProfilePhotoFieldProps = {
  //선택한 사진 주소. 없으면 업로드 버튼을 보여준다.
  photoUri: string | null;
  onUpload?: () => void;
  onChange?: () => void;
  onRemove?: () => void;
};

//프로필 사진 업로드 버튼, 또는 선택한 사진과 변경·삭제 버튼
export function ProfilePhotoField({
  photoUri,
  onUpload,
  onChange,
  onRemove,
}: ProfilePhotoFieldProps) {
  if (!photoUri) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onUpload}
        className="h-10 flex-row items-center gap-1 rounded-lg border border-gray-100 bg-gray-0 px-3"
      >
        <Folder variant="sm" className="text-gray-600" />
        <Text className="text-gray-600 text-b-04-m">사진 업로드</Text>
      </Pressable>
    );
  }

  return (
    <View className="items-center gap-3">
      <Image
        source={{ uri: photoUri }}
        style={{ width: 120, height: 120, borderRadius: 60 }}
        contentFit="cover"
        accessibilityLabel="프로필 사진"
      />
      <View className="flex-row gap-2">
        <PhotoActionButton
          label="사진변경"
          icon={<Swap variant="sm" className="text-gray-400" />}
          onPress={onChange}
        />
        <PhotoActionButton
          label="사진삭제"
          icon={<Cancel variant="sm" className="text-gray-400" />}
          onPress={onRemove}
        />
      </View>
    </View>
  );
}

type PhotoActionButtonProps = {
  label: string;
  icon: ReactNode;
  onPress?: () => void;
};

function PhotoActionButton({ label, icon, onPress }: PhotoActionButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      className="flex-row items-center border-b border-gray-200 pb-0.5"
    >
      <Text className="text-gray-400 text-b-04-r">{label}</Text>
      {icon}
    </Pressable>
  );
}
