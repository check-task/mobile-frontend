import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { LogoHeader } from "@/components/common/Header/LogoHeader";
import { useModal } from "@/hooks/useModal";
import { useThemePreference } from "@/hooks/useThemePreference";
import { cn } from "@/lib/utils";

import { AlarmSettingsCard } from "./AlarmSettingsCard";
import { FolderDeleteModalContent } from "./FolderDeleteModalContent";
import { FolderFormModalForm } from "./FolderFormModalForm";
import { FolderSettingsCard } from "./FolderSettingsCard";
import { PasswordChangeModalForm } from "./PasswordChangeModalForm";
import { ProfileEditModalForm } from "./ProfileEditModalForm";
import { ProfileSection } from "./ProfileSection";
import { DUMMY_USER, type SettingsFolder } from "./settingsData";
import { ThemeSettingsCard } from "./ThemeSettingsCard";

const CONTENT_BOTTOM_OFFSET = 40;

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { preference: themePreference, setPreference: setThemePreference } =
    useThemePreference();
  // TODO(api): 더미 대신 GET /api/v1/user/me, 변경은 각 API 로 저장
  const [user, setUser] = useState(DUMMY_USER);
  const [reordering, setReordering] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);

  const setFolders = (folders: SettingsFolder[]) =>
    setUser((prev) => ({ ...prev, folders }));

  const openFolderForm = (folder?: SettingsFolder) =>
    openModal({
      title: folder ? "폴더 수정" : "폴더 추가",
      headerIcon: "cancel",
      children: (
        <FolderFormModalForm
          initialName={folder?.name}
          initialColor={folder?.color}
          usedColors={user.folders
            .filter((other) => other.id !== folder?.id)
            .map((other) => other.color)}
          onSubmit={(name, color) => {
            setFolders(
              folder
                ? user.folders.map((other) =>
                    other.id === folder.id ? { ...other, name, color } : other
                  )
                : [...user.folders, { id: Date.now(), name, color }]
            );
            closeModal();
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
            setFolders(user.folders.filter((other) => other.id !== folder.id));
            closeModal();
          }}
        />
      ),
    });

  const openProfileEdit = () =>
    openModal({
      title: "내 정보 수정",
      headerIcon: "cancel",
      children: (
        <ProfileEditModalForm
          initialProfile={user}
          onSubmit={(profile) => {
            setUser((prev) => ({ ...prev, ...profile }));
            closeModal();
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
          <View pointerEvents={blockTouches} className={cn("gap-5", dimmed)}>
            <Text className="text-gray-900 text-h-02">설정</Text>
            <ProfileSection
              nickname={user.nickname}
              profileImage={user.profileImage}
              onPasswordPress={
                user.loginType === "LOCAL" ? openPasswordChange : undefined
              }
              onProfileEditPress={openProfileEdit}
            />
          </View>

          <View className="mt-5 gap-4">
            <Text className={cn("text-gray-900 text-h-04", dimmed)}>
              과제 관리
            </Text>
            <View pointerEvents={blockTouches} className={dimmed}>
              <AlarmSettingsCard
                deadlineAlarm={user.deadlineAlarm}
                taskAlarm={user.taskAlarm}
                onDeadlineAlarmChange={(deadlineAlarm) =>
                  setUser((prev) => ({ ...prev, deadlineAlarm }))
                }
                onTaskAlarmChange={(taskAlarm) =>
                  setUser((prev) => ({ ...prev, taskAlarm }))
                }
              />
            </View>
            <FolderSettingsCard
              folders={user.folders}
              reordering={reordering}
              onAdd={() => openFolderForm()}
              onEdit={openFolderForm}
              onDelete={openFolderDelete}
              onReorderStart={() => setReordering(true)}
              onReorderCancel={() => setReordering(false)}
              onReorderSave={(folders) => {
                setFolders(folders);
                setReordering(false);
              }}
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
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}
