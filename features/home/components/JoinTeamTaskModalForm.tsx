import { useState } from "react";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Chip } from "@/components/common/Chip/Chip";
import { Input } from "@/components/common/Input/Input";

import type { HomeFolder } from "../api/home.types";

type JoinTeamTaskModalFormProps = {
  folders: readonly HomeFolder[];
  /** 폴더를 고르지 않으면 `null` (서버 기본 폴더) */
  onSubmit: (inviteCode: string, folderId: number | null) => void;
};

export function JoinTeamTaskModalForm({
  folders,
  onSubmit,
}: JoinTeamTaskModalFormProps) {
  const [folderId, setFolderId] = useState<number | null>(null);
  const [inviteCode, setInviteCode] = useState("");
  const trimmedCode = inviteCode.trim();

  return (
    <View className="gap-5 pb-5 pt-5">
      <View className="gap-3">
        <Text className="text-gray-800 text-b-03-m">폴더색</Text>
        <View className="flex-row flex-wrap gap-2">
          {folders.map((folder) => (
            <Chip
              key={folder.id}
              label={folder.name}
              color={folder.color}
              variant={folder.id === folderId ? "fill" : "default"}
              onPress={() =>
                setFolderId((prev) => (prev === folder.id ? null : folder.id))
              }
            />
          ))}
        </View>
      </View>
      <View className="gap-3">
        <Text className="text-gray-800 text-b-03-m">초대코드</Text>
        <Input
          shape="modal"
          value={inviteCode}
          onChangeText={setInviteCode}
          placeholder="공유받은 코드를 붙여 넣으세요."
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>
      <Button
        label="팀 과제 참여"
        size="modal"
        className="mt-2"
        disabled={trimmedCode === ""}
        onPress={() => onSubmit(trimmedCode, folderId)}
      />
    </View>
  );
}
