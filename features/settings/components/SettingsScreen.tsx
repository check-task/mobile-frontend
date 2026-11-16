import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";
import { useThemePreference } from "@/hooks/useThemePreference";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";
import { toFolderHex } from "@/lib/folderColor";
import { cn } from "@/lib/utils";

import type { SettingsFolder } from "../api/settings.types";
import { toUpdateProfileRequest } from "../api/settingsMapper";
import { useCreateFolderMutation } from "../hooks/useCreateFolderMutation";
import { useDeleteFolderMutation } from "../hooks/useDeleteFolderMutation";
import { useReorderFoldersMutation } from "../hooks/useReorderFoldersMutation";
import { useSettingsUserQuery } from "../hooks/useSettingsUserQuery";
import {
  type AlarmKind,
  useUpdateAlarmMutation,
} from "../hooks/useUpdateAlarmMutation";
import { useUpdateFolderMutation } from "../hooks/useUpdateFolderMutation";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";
import { AlarmSettingsCard } from "./AlarmSettingsCard";
import { FolderDeleteModalContent } from "./FolderDeleteModalContent";
import { FolderFormModalForm } from "./FolderFormModalForm";
import { FolderSettingsCard } from "./FolderSettingsCard";
import { PasswordChangeModalForm } from "./PasswordChangeModalForm";
import { ProfileEditModalForm } from "./ProfileEditModalForm";
import { ProfileSection } from "./ProfileSection";
import { ThemeSettingsCard } from "./ThemeSettingsCard";

const CONTENT_BOTTOM_OFFSET = 40;

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const { preference: themePreference, setPreference: setThemePreference } =
    useThemePreference();
  const { data: user, isError, refetch } = useSettingsUserQuery();
  const createFolderMutation = useCreateFolderMutation();
  const updateFolderMutation = useUpdateFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();
  const reorderFoldersMutation = useReorderFoldersMutation();
  const updateProfileMutation = useUpdateProfileMutation();
  const updateAlarmMutation = useUpdateAlarmMutation();
  // 고르자마자 보이도록 저장 중인 값을 먼저 그린다
  const [alarmDraft, setAlarmDraft] = useState<
    Partial<Record<AlarmKind, number>>
  >({});
  const [reordering, setReordering] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  const showFail = (error: unknown, fallback: string) =>
    showToast("fail", getErrorMessage(error, fallback));

  const changeAlarm = (kind: AlarmKind, hours: number) => {
    setAlarmDraft((prev) => ({ ...prev, [kind]: hours }));
    updateAlarmMutation.mutate(
      { kind, hours },
      {
        onError: (error) => {
          // 그사이 다른 값을 고르지 않았을 때만 서버 값으로 되돌린다
          setAlarmDraft((prev) =>
            prev[kind] === hours ? { ...prev, [kind]: undefined } : prev
          );
          showFail(error, "알림 시간을 저장하지 못했습니다.");
        },
      }
    );
  };

  const openFolderForm = (folders: SettingsFolder[], folder?: SettingsFolder) =>
    openModal({
      title: folder ? "폴더 수정" : "폴더 추가",
      headerIcon: "cancel",
      children: (
        <FolderFormModalForm
          initialName={folder?.name}
          initialColor={folder?.color}
          usedColors={folders
            .filter((other) => other.id !== folder?.id)
            .map((other) => other.color)}
          onSubmit={async (name, color) => {
            const body = { folderTitle: name, color: toFolderHex(color) };
            try {
              if (folder) {
                await updateFolderMutation.mutateAsync({
                  folderId: folder.id,
                  ...body,
                });
              } else {
                await createFolderMutation.mutateAsync(body);
              }
              closeModal();
            } catch (error) {
              showFail(error, "폴더를 저장하지 못했습니다.");
            }
          }}
        />
      ),
    });

  const openFolderDelete = (folder: SettingsFolder) =>
    openModal({
      title: "폴더 삭제",
      children: (
        <FolderDeleteModalContent
          folder={folder}
          onCancel={closeModal}
          onConfirm={() => {
            // 먼저 닫아야 두 번 눌리지 않고, 실패 토스트가 모달에 가리지 않는다
            closeModal();
            deleteFolderMutation.mutate(folder.id, {
              onError: (error) =>
                showFail(error, "폴더를 삭제하지 못했습니다."),
            });
          }}
        />
      ),
    });

  const openProfileEdit = (initialProfile: NonNullable<typeof user>) =>
    openModal({
      title: "내 정보 수정",
      headerIcon: "cancel",
      children: (
        <ProfileEditModalForm
          initialProfile={initialProfile}
          onSubmit={async (profile, photo) => {
            try {
              await updateProfileMutation.mutateAsync(
                toUpdateProfileRequest(initialProfile, profile, photo)
              );
              closeModal();
            } catch (error) {
              showFail(error, "내 정보를 저장하지 못했습니다.");
            }
          }}
        />
      ),
    });

  // 비밀번호 변경·회원탈퇴·알림 설정 API 는 인증/알림 담당자가 연결한다
  const openPasswordChange = () =>
    openModal({
      title: "비밀번호 변경",
      headerIcon: "cancel",
      children: <PasswordChangeModalForm onSubmit={closeModal} />,
    });

  const openWithdraw = () =>
    openModal({
      title: "회원탈퇴",
      children: (
        <DeleteConfirmModalContent
          heading="회원탈퇴를 진행하시겠습니까?"
          description="탈퇴 시 계정은 즉시 비활성화되며, 회원 정보는 4일간 보관 후 영구 삭제됩니다. 보관 기간 내에는 계정 복구가 가능합니다."
          confirmLabel="예"
          cancelLabel="아니오"
          onConfirm={closeModal}
          onCancel={closeModal}
        />
      ),
    });

  const saveFolderOrder = (folders: SettingsFolder[]) => {
    if (reorderFoldersMutation.isPending) return;
    reorderFoldersMutation.mutate(
      folders.map((folder) => folder.id),
      {
        onSuccess: () => setReordering(false),
        onError: (error) => showFail(error, "폴더 순서를 저장하지 못했습니다."),
      }
    );
  };

  // 순서 변경 중에는 폴더 카드만 조작할 수 있게 나머지를 흐리게 막는다
  const dimmed = reordering ? "opacity-40" : "";
  const blockTouches = reordering ? "none" : "auto";

  return (
    // 순서 변경 드래그(GestureDetector)는 네이티브에서 이 루트 안에 있어야 한다
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-0" style={{ paddingTop: insets.top }}>
        <LogoHeader onMenuPress={() => router.navigate("/menu")} />
        <ScrollView
          scrollEnabled={!scrollLocked}
          contentContainerClassName="gap-5 px-4 pt-5"
          contentContainerStyle={{
            paddingBottom: insets.bottom + CONTENT_BOTTOM_OFFSET,
          }}
        >
          {!user ? (
            isError ? (
              <View className="items-center gap-4 pt-10">
                <Text className="text-gray-600 text-b-02-r">
                  내 정보를 불러오지 못했어요.
                </Text>
                <Button
                  label="다시 시도"
                  variant="gray"
                  size="sm"
                  className="w-auto"
                  onPress={() => refetch()}
                />
              </View>
            ) : null
          ) : (
            <>
              <View
                pointerEvents={blockTouches}
                className={cn("gap-5", dimmed)}
              >
                <Text className="text-gray-900 text-h-02">설정</Text>
                <ProfileSection
                  nickname={user.nickname}
                  profileImage={user.profileImage}
                  onPasswordPress={
                    user.loginType === "LOCAL" ? openPasswordChange : undefined
                  }
                  onProfileEditPress={() => openProfileEdit(user)}
                />
              </View>

              <View className="mt-5 gap-4">
                <Text className={cn("text-gray-900 text-h-04", dimmed)}>
                  과제 관리
                </Text>
                <View pointerEvents={blockTouches} className={dimmed}>
                  <AlarmSettingsCard
                    deadlineAlarm={
                      alarmDraft.deadlineAlarm ?? user.deadlineAlarm
                    }
                    taskAlarm={alarmDraft.taskAlarm ?? user.taskAlarm}
                    onDeadlineAlarmChange={(hours) =>
                      changeAlarm("deadlineAlarm", hours)
                    }
                    onTaskAlarmChange={(hours) =>
                      changeAlarm("taskAlarm", hours)
                    }
                  />
                </View>
                <FolderSettingsCard
                  folders={user.folders}
                  reordering={reordering}
                  onAdd={() => openFolderForm(user.folders)}
                  onEdit={(folder) => openFolderForm(user.folders, folder)}
                  onDelete={openFolderDelete}
                  onReorderStart={() => setReordering(true)}
                  onReorderCancel={() => setReordering(false)}
                  onReorderSave={saveFolderOrder}
                  onHandleHoldChange={setScrollLocked}
                />
              </View>

              <View
                pointerEvents={blockTouches}
                className={cn("mt-5 gap-4", dimmed)}
              >
                <Text className="text-gray-900 text-h-04">테마 설정</Text>
                <ThemeSettingsCard
                  value={themePreference}
                  onChange={setThemePreference}
                />
              </View>

              <View pointerEvents={blockTouches} className={cn("mt-5", dimmed)}>
                <Pressable
                  accessibilityRole="button"
                  onPress={openWithdraw}
                  className="self-start border-b border-gray-400 pb-1"
                >
                  <Text className="text-gray-400 text-b-04-m">회원탈퇴</Text>
                </Pressable>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
