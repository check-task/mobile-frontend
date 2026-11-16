import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Chip } from "@/components/common/Chip/Chip";
import { Input } from "@/components/common/Input/Input";
import { FOLDER_COLOR_OPTIONS } from "@/constants/settings";
import type { FolderColor } from "@/types/folder.types";

// Figma 칩 라벨이 `chip 1` 자리표시자라 색 이름을 임시로 쓴다
const COLOR_LABEL: Record<(typeof FOLDER_COLOR_OPTIONS)[number], string> = {
  "sub-01": "빨강",
  "sub-02": "노랑",
  "sub-03": "초록",
  "sub-04": "보라",
  "sub-05": "검정",
};

type FolderFormModalFormProps = {
  /** 수정이면 기존 이름·색 */
  initialName?: string;
  initialColor?: FolderColor;
  /** 다른 폴더가 이미 쓰는 색. 고르면 에러 문구를 보여주고 저장을 막는다 */
  usedColors: readonly FolderColor[];
  /** 끝날 때까지 버튼을 꺼 둔다 */
  onSubmit: (name: string, color: FolderColor) => Promise<void>;
};

export function FolderFormModalForm({
  initialName = "",
  initialColor,
  usedColors,
  onSubmit,
}: FolderFormModalFormProps) {
  const [name, setName] = useState(initialName);
  // 팔레트에 없는 색(sub-null)은 고른 것으로 보지 않아 새 색을 골라야 저장된다
  const [color, setColor] = useState<FolderColor | undefined>(
    initialColor === "sub-null" ? undefined : initialColor
  );
  // 두 번 눌러 요청이 두 번 가지 않게 한다
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isColorUsed = color !== undefined && usedColors.includes(color);
  const trimmedName = name.trim();
  const isChanged = trimmedName !== initialName || color !== initialColor;
  const canSave =
    trimmedName !== "" && color !== undefined && !isColorUsed && isChanged;

  return (
    <View className="gap-6 pb-5 pt-5">
      <View className="gap-4">
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-r">폴더명</Text>
          <Input
            shape="modal"
            value={name}
            onChangeText={setName}
            placeholder="폴더명을 입력하세요"
          />
        </View>
        <View className="gap-2">
          <View className="gap-3">
            <Text className="text-gray-900 text-b-02-r">폴더색</Text>
            <View className="flex-row flex-wrap gap-2">
              {FOLDER_COLOR_OPTIONS.map((option) => (
                <Chip
                  key={option}
                  label={COLOR_LABEL[option]}
                  color={option}
                  variant={
                    option === color
                      ? "fill"
                      : usedColors.includes(option)
                        ? "muted"
                        : "default"
                  }
                  selected={option === color}
                  onPress={() => setColor(option)}
                />
              ))}
            </View>
          </View>
          {isColorUsed ? (
            <Text className="text-sub-01 text-b-04-r">
              이미 사용중인 폴더색입니다.
            </Text>
          ) : null}
        </View>
      </View>
      <Button
        label="변경사항 저장"
        size="modal"
        disabled={!canSave || isSubmitting}
        onPress={async () => {
          if (!color) return;
          setIsSubmitting(true);
          try {
            await onSubmit(trimmedName, color);
          } finally {
            setIsSubmitting(false);
          }
        }}
      />
    </View>
  );
}
