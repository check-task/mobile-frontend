import { useRouter } from "expo-router";
import type { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Checkbox } from "@/components/common/Checkbox/Checkbox";
import { Chip } from "@/components/common/Chip/Chip";
import { BackHeader } from "@/components/common/Header/BackHeader";
import { Input } from "@/components/common/Input/Input";
import { cn } from "@/lib/utils";

import type { TaskFormValue } from "../api/taskForm.types";
import { useMyFoldersQuery } from "../hooks/useMyFoldersQuery";
import { useTaskForm } from "../hooks/useTaskForm";

import { DueDateField } from "./DueDateField";
import { TaskFormField } from "./TaskFormField";
import { TaskResourceSection } from "./TaskResourceSection";
import { TaskSubTaskSection } from "./TaskSubTaskSection";

const EMPTY_VALUE: TaskFormValue = {
  isTeam: false,
  title: "",
  folderId: null,
  deadline: null,
  subTasks: [],
  resources: [],
};

const SCROLL_BOTTOM_GAP = 32;
const FOOTER_BOTTOM_GAP = 46;

function LabeledCheckbox({
  label,
  checked,
  onPress,
  disabled = false,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
  /** Figma 팀 과제 수정처럼 박스와 라벨을 흐린 회색으로 그리고 누를 수 없게 한다 */
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      className="flex-row items-center gap-1"
    >
      {/* 박스를 직접 눌러도 토글되게 넘긴다. 안 넘기면 Checkbox 가 터치만 먹고 아무것도 안 한다. */}
      <Checkbox checked={checked} onPress={onPress} disabled={disabled} />
      <Text
        className={cn(
          disabled ? "text-gray-400" : "text-gray-600",
          "text-b-02-m"
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export type TaskFormProps = {
  /** 화면 제목 (예: `과제 등록`) */
  heading: string;
  /** 수정 화면에서 채워 둘 기존 값 */
  initialValue?: TaskFormValue;
  /** 수정 화면: 팀 → 개인 변경 막기, TASK `전체삭제`, TASK 개별 삭제 `되돌리기` 스낵바, 자료 영역 숨김 */
  isEdit?: boolean;
  /** 하단 버튼 영역. 현재 입력값을 받아 제출한다. */
  footer: (value: TaskFormValue) => ReactNode;
};

export function TaskForm({
  heading,
  initialValue = EMPTY_VALUE,
  isEdit = false,
  footer,
}: TaskFormProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const foldersQuery = useMyFoldersQuery();
  const form = useTaskForm(initialValue, isEdit);
  const { isTeam, title, folderId, deadline, subTasks, resources } = form.value;

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <BackHeader onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 px-4 pt-5"
        contentContainerStyle={{ paddingBottom: SCROLL_BOTTOM_GAP }}
      >
        <Text className="text-gray-900 text-h-02">{heading}</Text>

        <View className="flex-row items-center gap-3">
          <LabeledCheckbox
            label="팀프로젝트"
            checked={isTeam}
            // 수정 화면에서는 개인 → 팀만 바꿀 수 있다. 팀 → 개인은 서버가 지원하지 않는다
            onPress={form.toggleTeam}
            disabled={isEdit && initialValue.isTeam}
          />
          {/* 웬투밋 연동 전까지 잠시 숨긴다
          <LabeledCheckbox
            label="웬투밋 추가"
            checked={form.withWhen2meet}
            onPress={form.toggleWhen2meet}
          />
          */}
        </View>

        <View className="h-px bg-gray-200" />

        <View className="gap-5">
          <View className="gap-5">
            <TaskFormField label="과제명">
              <Input
                shape="box"
                value={title}
                onChangeText={form.setTitle}
                placeholder="과제명을 입력하세요."
              />
            </TaskFormField>

            <TaskFormField label="폴더색">
              <View className="flex-row flex-wrap gap-2">
                {foldersQuery.isError ? (
                  <Text className="text-gray-600 text-b-02-r">
                    폴더를 불러오지 못했어요.
                  </Text>
                ) : null}
                {foldersQuery.data?.map((folder) => (
                  <Chip
                    key={folder.folderId}
                    label={folder.folderTitle}
                    color={folder.color}
                    variant={folder.folderId === folderId ? "fill" : "default"}
                    selected={folder.folderId === folderId}
                    onPress={() => form.toggleFolder(folder.folderId)}
                  />
                ))}
              </View>
            </TaskFormField>

            <TaskFormField label="마감일">
              <View className="self-start">
                <DueDateField
                  value={deadline}
                  onChange={form.changeDeadline}
                  showTime
                  placeholder="날짜를 선택하세요"
                />
              </View>
            </TaskFormField>
          </View>

          <View className="h-px bg-gray-200" />

          <View className="gap-5">
            <TaskSubTaskSection
              subTasks={subTasks}
              deadline={deadline}
              onChange={form.updateSubTask}
              onRemove={form.removeSubTask}
              onAdd={form.addSubTask}
              onRemoveAll={isEdit ? form.confirmRemoveAllSubTasks : undefined}
            />
            {/* 자료는 상세 화면에서 추가·수정한다 (Figma 과제 수정 화면에 자료 영역 없음) */}
            {isEdit ? null : (
              <TaskResourceSection
                resources={resources}
                onOpenModal={form.openResourceModal}
                onRemove={form.removeResource}
              />
            )}
          </View>
        </View>
      </ScrollView>

      <View
        className="gap-3 px-4 pt-3"
        style={{ paddingBottom: insets.bottom + FOOTER_BOTTOM_GAP }}
      >
        {footer(form.value)}
      </View>
    </View>
  );
}
