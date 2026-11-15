import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Input } from "@/components/common/Input/Input";
import { Folder, Link } from "@/components/icons";
import { cn } from "@/lib/utils";

export type ResourceType = "file" | "url";

export type ResourceDraft = {
  type: ResourceType;
  name: string;
  /** 파일이면 파일 경로(이름), URL 이면 주소 */
  path: string;
};

const TYPE_TABS = [
  { type: "file", label: "파일 업로드", Icon: Folder },
  { type: "url", label: "URL 업로드", Icon: Link },
] as const;

const FIELD_COPY: Record<
  ResourceType,
  {
    name: string;
    namePlaceholder: string;
    path: string;
    pathPlaceholder: string;
  }
> = {
  file: {
    name: "파일명",
    namePlaceholder: "파일명을 입력하세요.",
    path: "파일경로",
    pathPlaceholder: "파일을 선택하세요",
  },
  // shortcut: URL 탭 Figma 프레임이 없어 문구를 임시로 정했다, 디자인 받으면 교체
  url: {
    name: "자료명",
    namePlaceholder: "자료명을 입력하세요.",
    path: "URL",
    pathPlaceholder: "URL을 입력하세요.",
  },
};

export type ResourceAddModalFormProps = {
  /** 수정할 때 채워 둘 값 */
  initialValue?: ResourceDraft;
  /** `저장`을 눌렀을 때 */
  onSave: (value: ResourceDraft) => void;
};

/** Figma `자료 추가 모달`. 파일/URL 탭, 이름·경로 입력, `저장`으로 구성된다. */
export function ResourceAddModalForm({
  initialValue,
  onSave,
}: ResourceAddModalFormProps) {
  const [type, setType] = useState<ResourceType>(initialValue?.type ?? "file");
  const [name, setName] = useState(initialValue?.name ?? "");
  const [path, setPath] = useState(initialValue?.path ?? "");
  const copy = FIELD_COPY[type];
  // 파일은 이름이 선택 사항, URL 은 이름·주소 모두 필수 (POST /reference/data 규칙)
  const canSave =
    path.trim().length > 0 && (type === "file" || name.trim().length > 0);

  const changeType = (next: ResourceType) => {
    if (next === type) {
      return;
    }
    setType(next);
    setPath("");
  };

  return (
    <View className="pb-5 pt-4">
      <View className="flex-row rounded bg-gray-100 px-2 py-1">
        {TYPE_TABS.map(({ type: tabType, label, Icon }) => {
          const selected = tabType === type;

          return (
            <Pressable
              key={tabType}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => changeType(tabType)}
              className={cn(
                "flex-1 flex-row items-center justify-center gap-1 rounded py-1",
                selected ? "bg-gray-0" : ""
              )}
            >
              <Icon className={selected ? "text-gray-700" : "text-gray-400"} />
              <Text
                className={
                  selected
                    ? "text-gray-700 text-b-03-m"
                    : "text-gray-400 text-b-03-r"
                }
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-6 gap-3">
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-r">{copy.name}</Text>
          <Input
            shape="modal"
            value={name}
            onChangeText={setName}
            placeholder={copy.namePlaceholder}
          />
        </View>
        <View className="gap-3">
          <Text className="text-gray-900 text-b-02-r">{copy.path}</Text>
          {/* [임시] shortcut: 파일명 하나에 파일 하나만 받는다(원래는 여러 파일), 다중 파일 UI·API 확정 후 확장 */}
          {/* TODO(api): 파일 탭에서는 이 칸을 누르면 expo-document-picker 로 파일을 골라 채운다 */}
          <Input
            shape="modal"
            value={path}
            onChangeText={setPath}
            placeholder={copy.pathPlaceholder}
            autoCapitalize="none"
            keyboardType={type === "url" ? "url" : "default"}
          />
        </View>
      </View>

      <Button
        label="저장"
        size="modal"
        disabled={!canSave}
        onPress={() => onSave({ type, name: name.trim(), path: path.trim() })}
        className="mt-6"
      />
    </View>
  );
}
