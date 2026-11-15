import { useRouter } from "expo-router";
import { type ReactNode, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Checkbox } from "@/components/common/Checkbox/Checkbox";
import { Chip } from "@/components/common/Chip/Chip";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { BackHeader } from "@/components/common/Header/BackHeader";
import { Input } from "@/components/common/Input/Input";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";

import { useMyFoldersQuery } from "../hooks/useMyFoldersQuery";

import { type DueDate, DueDateField, toDueDateTime } from "./DueDateField";
import {
  ResourceAddModalForm,
  type ResourceDraft,
} from "./ResourceAddModalForm";
import { TaskFormField } from "./TaskFormField";
import { TaskResourceSection } from "./TaskResourceSection";
import { TaskSubTaskSection } from "./TaskSubTaskSection";

export type SubTaskDraft = {
  id: string;
  title: string;
  dueDate: DueDate | null;
};
export type ResourceDraftItem = ResourceDraft & { id: string };

export type TaskFormValue = {
  isTeam: boolean;
  title: string;
  folderId: number | null;
  deadline: DueDate | null;
  subTasks: SubTaskDraft[];
  resources: ResourceDraftItem[];
};

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
}: {
  label: string;
  checked: boolean;
  /** 없으면 값만 보여주고 누를 수 없다 */
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      className="flex-row items-center gap-1"
    >
      {/* 박스를 직접 눌러도 토글되게 넘긴다. 안 넘기면 Checkbox 가 터치만 먹고 아무것도 안 한다. */}
      <Checkbox checked={checked} onPress={onPress} />
      <Text className="text-gray-600 text-b-02-m">{label}</Text>
    </Pressable>
  );
}

export type TaskFormProps = {
  /** 화면 제목 (예: `과제 등록`) */
  heading: string;
  /** 수정 화면에서 채워 둘 기존 값 */
  initialValue?: TaskFormValue;
  /** 수정 화면: 과제 유형 변경 막기, TASK `전체삭제`, TASK·자료 개별 삭제 `되돌리기` 스낵바 */
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
  const { openModal, closeModal } = useModal();
  const { showSnackbar } = useToast();
  const foldersQuery = useMyFoldersQuery();
  const nextId = useRef(0);

  const [isTeam, setIsTeam] = useState(initialValue.isTeam);
  // shortcut: 사양에 없는 Figma 옵션이라 상태만 둔다, 웬투밋 범위 정해지면 연결
  const [withWhen2meet, setWithWhen2meet] = useState(false);
  const [title, setTitle] = useState(initialValue.title);
  const [folderId, setFolderId] = useState(initialValue.folderId);
  const [deadline, setDeadline] = useState(initialValue.deadline);
  const [subTasks, setSubTasks] = useState(initialValue.subTasks);
  const [resources, setResources] = useState(initialValue.resources);

  const newId = () => `new-${nextId.current++}`;

  const changeDeadline = (next: DueDate | null) => {
    setDeadline(next);
    if (!next) return;
    // 새 과제 마감 시각을 넘는 세부 과제는 마감일을 비운다. 시간 없는 세부 과제는 자정이라 당일이면 유지된다.
    const limit = toDueDateTime(next);
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.dueDate && subTask.dueDate.date > limit
          ? { ...subTask, dueDate: null }
          : subTask
      )
    );
  };

  const updateSubTask = (id: string, patch: Partial<SubTaskDraft>) => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, ...patch } : subTask
      )
    );
  };

  const removeSubTask = (target: SubTaskDraft) => {
    const index = subTasks.findIndex((subTask) => subTask.id === target.id);
    setSubTasks((current) =>
      current.filter((subTask) => subTask.id !== target.id)
    );
    if (!isEdit) return;
    showSnackbar(`${target.title || "TASK"}이 삭제되었습니다`, () =>
      setSubTasks((current) => [
        ...current.slice(0, index),
        target,
        ...current.slice(index),
      ])
    );
  };

  const removeResource = (target: ResourceDraftItem) => {
    const index = resources.findIndex((item) => item.id === target.id);
    setResources((current) => current.filter((item) => item.id !== target.id));
    if (!isEdit) return;
    showSnackbar(`${target.name || target.path}이 삭제되었습니다`, () =>
      setResources((current) => [
        ...current.slice(0, index),
        target,
        ...current.slice(index),
      ])
    );
  };

  const confirmRemoveAllSubTasks = () => {
    openModal({
      title: "TASK 삭제",
      children: (
        <DeleteConfirmModalContent
          heading="모든 세부과제를 삭제하시겠습니까?"
          description="삭제된 과제는 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            setSubTasks([]);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const openResourceModal = (target?: ResourceDraftItem) => {
    openModal({
      title: target ? "자료 수정" : "자료 추가",
      headerIcon: "cancel",
      children: (
        <ResourceAddModalForm
          initialValue={target}
          onSave={(value) => {
            setResources((current) =>
              target
                ? current.map((item) =>
                    item.id === target.id ? { ...item, ...value } : item
                  )
                : [...current, { ...value, id: newId() }]
            );
            closeModal();
          }}
        />
      ),
    });
  };

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
            // shortcut: 수정 화면은 유형 변경을 임시로 막는다, convert-to-team 연동이 정해지면 연다
            onPress={isEdit ? undefined : () => setIsTeam(!isTeam)}
          />
          <LabeledCheckbox
            label="웬투밋 추가"
            checked={withWhen2meet}
            onPress={() => setWithWhen2meet(!withWhen2meet)}
          />
        </View>

        <View className="h-px bg-gray-200" />

        <View className="gap-5">
          <View className="gap-5">
            <TaskFormField label="과제명">
              <Input
                shape="box"
                value={title}
                onChangeText={setTitle}
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
                    // 다시 누르면 선택 해제 → folderId 생략(미지정)
                    onPress={() =>
                      setFolderId(
                        folder.folderId === folderId ? null : folder.folderId
                      )
                    }
                  />
                ))}
              </View>
            </TaskFormField>

            <TaskFormField label="마감일">
              <View className="self-start">
                <DueDateField
                  value={deadline}
                  onChange={changeDeadline}
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
              onChange={updateSubTask}
              onRemove={removeSubTask}
              onAdd={() =>
                setSubTasks((current) => [
                  ...current,
                  { id: newId(), title: "", dueDate: null },
                ])
              }
              onRemoveAll={isEdit ? confirmRemoveAllSubTasks : undefined}
            />
            <TaskResourceSection
              resources={resources}
              onOpenModal={openResourceModal}
              onRemove={removeResource}
            />
          </View>
        </View>
      </ScrollView>

      <View
        className="gap-3 px-4 pt-3"
        style={{ paddingBottom: insets.bottom + FOOTER_BOTTOM_GAP }}
      >
        {footer({ isTeam, title, folderId, deadline, subTasks, resources })}
      </View>
    </View>
  );
}
