import { Image } from "expo-image";
import { useState } from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export type MemberAvatarProps = {
  /** 프로필 사진 주소. 없거나 불러오지 못하면 배경색 동그라미만 그린다. */
  uri: string | null;
  /** 크기와 사진이 없을 때의 배경색 (예: `h-4 w-4 bg-blue-200`) */
  className: string;
};

export function MemberAvatar({ uri, className }: MemberAvatarProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const showImage = uri !== null && uri !== failedUri;

  return (
    <View className={cn("overflow-hidden rounded-full", className)}>
      {showImage ? (
        <Image
          source={{ uri }}
          contentFit="cover"
          style={{ width: "100%", height: "100%" }}
          onError={() => setFailedUri(uri)}
        />
      ) : null}
    </View>
  );
}
