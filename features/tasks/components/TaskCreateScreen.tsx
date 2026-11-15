import { useRouter } from "expo-router";
import { type ReactNode, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { Checkbox } from "@/components/common/Checkbox/Checkbox";
import { Chip } from "@/components/common/Chip/Chip";
import { BackHeader } from "@/components/common/Header/BackHeader";
import { Input } from "@/components/common/Input/Input";
import { Cancel } from "@/components/icons";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";

import {
  type CreateTaskInput,
  useCreateTaskMutation,
} from "../hooks/useCreateTaskMutation";
import { useMyFoldersQuery } from "../hooks/useMyFoldersQuery";

import { AddItemButton } from "./AddItemButton";
import { type DueDate, DueDateField, toDueDateTime } from "./DueDateField";
import {
  ResourceAddModalForm,
  type ResourceDraft,
} from "./ResourceAddModalForm";
import { ResourceItem } from "./ResourceItem";

type SubTaskDraft = { id: string; title: string; dueDate: DueDate | null };
type ResourceDraftItem = ResourceDraft & { id: string };

const SCROLL_BOTTOM_GAP = 32;
const SUBMIT_BOTTOM_GAP = 46;

function toReferenceParams({
  type,
  name,
  path,
  file,
}: ResourceDraft): CreateTaskInput["references"][number] | null {
  if (type === "url") return { type, name, url: path };
  if (!file) return null;
  return {
    type,
    name: name || undefined,
    // web 은 File 객체, native 는 uri 파트로 보낸다
    file:
      Platform.OS === "web" && file.file
        ? file.file
        : {
            uri: file.uri,
            name: file.name,
            type: file.mimeType ?? "application/octet-stream",
          },
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="gap-3">
      <Text className="text-gray-900 text-b-02-r">{label}</Text>
      {children}
    </View>
  );
}

function LabeledCheckbox({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      className="flex-row items-center gap-1"
    >
      {/* 박스를 직접 눌러도 토글되게 넘긴다. 안 넘기면 Checkbox 가 터치만 먹고 아무것도 안 한다. */}
      <Checkbox checked={checked} onPress={onPress} />
      <Text className="text-gray-600 text-b-02-m">{label}</Text>
    </Pressable>
  );
}

export function TaskCreateScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const foldersQuery = useMyFoldersQuery();
  const createTaskMutation = useCreateTaskMutation();
  const nextId = useRef(0);

  const [isTeam, setIsTeam] = useState(false);
  // shortcut: 사양에 없는 Figma 옵션이라 상태만 둔다, 웬투밋 범위 정해지면 연결
  const [withWhen2meet, setWithWhen2meet] = useState(false);
  const [title, setTitle] = useState("");
  const [folderId, setFolderId] = useState<number | null>(null);
  const [deadline, setDeadline] = useState<DueDate | null>(null);
  const [subTasks, setSubTasks] = useState<SubTaskDraft[]>([]);
  const [resources, setResources] = useState<ResourceDraftItem[]>([]);

  const canSubmit =
    title.trim().length > 0 &&
    deadline !== null &&
    !createTaskMutation.isPending;
  const newId = () => String(nextId.current++);

  const changeDeadline = (next: DueDate | null) => {
    setDeadline(next);
    if (!next) return;
    // 과제 마감일보다 늦은 날짜의 세부 과제는 마감일을 비운다.
    const lastDay = new Date(next.date).setHours(23, 59, 59, 999);
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.dueDate && subTask.dueDate.date.getTime() > lastDay
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

  const submit = () => {
    if (!deadline) return;
    const deadlineTime = toDueDateTime(deadline);
    createTaskMutation.mutate(
      {
        task: {
          title: title.trim(),
          deadline: deadlineTime.toISOString(),
          type: isTeam ? "TEAM" : "PERSONAL",
          ...(folderId !== null && { folderId }),
          subTasks: subTasks
            .filter((subTask) => subTask.title.trim().length > 0)
            .map((subTask) => ({
              title: subTask.title.trim(),
              // 시간 없이 마감일 당일을 고르면 23:59 가 과제 마감 시각을 넘을 수 있어 과제 마감으로 맞춘다.
              endDate: subTask.dueDate
                ? new Date(
                    Math.min(
                      toDueDateTime(subTask.dueDate).getTime(),
                      deadlineTime.getTime()
                    )
                  ).toISOString()
                : null,
            })),
        },
        references: resources
          .map(toReferenceParams)
          .filter((params) => params !== null),
      },
      {
        onSuccess: ({ taskId, failedReferenceCount }) => {
          if (failedReferenceCount > 0) {
            showToast(
              "fail",
              `자료 ${failedReferenceCount}개를 올리지 못했어요.`
            );
          }
          router.replace({
            pathname: isTeam
              ? "/tasks/team/[taskId]"
              : "/tasks/personal/[taskId]",
            params: { taskId: String(taskId) },
          });
        },
        onError: (error) =>
          showToast(
            "fail",
            error instanceof ApiError
              ? error.reason
              : "과제를 등록하지 못했어요."
          ),
      }
    );
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
        <Text className="text-gray-900 text-h-02">과제 등록</Text>

        <View className="flex-row items-center gap-3">
          <LabeledCheckbox
            label="팀프로젝트"
            checked={isTeam}
            onPress={() => setIsTeam(!isTeam)}
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
            <Field label="과제명">
              <Input
                shape="box"
                value={title}
                onChangeText={setTitle}
                placeholder="과제명을 입력하세요."
              />
            </Field>

            <Field label="폴더색">
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
            </Field>

            <Field label="마감일">
              <View className="self-start">
                <DueDateField
                  value={deadline}
                  onChange={changeDeadline}
                  showTime
                  placeholder="날짜를 선택하세요"
                />
              </View>
            </Field>
          </View>

          <View className="h-px bg-gray-200" />

          <View className="gap-5">
            <Field label="TASK">
              {subTasks.length > 0 ? (
                <View className="gap-2">
                  {subTasks.map((subTask) => (
                    <View
                      key={subTask.id}
                      className="flex-row items-center gap-1"
                    >
                      <View className="flex-1 flex-row items-center gap-2">
                        <Input
                          shape="line"
                          value={subTask.title}
                          onChangeText={(text) =>
                            updateSubTask(subTask.id, { title: text })
                          }
                          placeholder="과제명을 입력하세요."
                          className="flex-1"
                        />
                        <DueDateField
                          value={subTask.dueDate}
                          onChange={(dueDate) =>
                            updateSubTask(subTask.id, { dueDate })
                          }
                          allowNoDate
                          maxDate={deadline}
                        />
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="TASK 삭제"
                        hitSlop={8}
                        onPress={() =>
                          setSubTasks((current) =>
                            current.filter((item) => item.id !== subTask.id)
                          )
                        }
                      >
                        <Cancel className="text-gray-600" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}
              <AddItemButton
                label="TASK 추가"
                onPress={() =>
                  setSubTasks((current) => [
                    ...current,
                    { id: newId(), title: "", dueDate: null },
                  ])
                }
              />
            </Field>

            <Field label="자료">
              {resources.length > 0 ? (
                <View className="gap-2">
                  {resources.map((resource) => (
                    <ResourceItem
                      key={resource.id}
                      title={resource.name || resource.path}
                      link={resource.path}
                      onEdit={() => openResourceModal(resource)}
                      onDelete={() =>
                        setResources((current) =>
                          current.filter((item) => item.id !== resource.id)
                        )
                      }
                    />
                  ))}
                </View>
              ) : null}
              <AddItemButton
                label="자료 추가"
                onPress={() => openResourceModal()}
              />
            </Field>
          </View>
        </View>
      </ScrollView>

      <View
        className="px-4 pt-3"
        style={{ paddingBottom: insets.bottom + SUBMIT_BOTTOM_GAP }}
      >
        <Button
          label={createTaskMutation.isPending ? "등록 중..." : "과제 등록"}
          disabled={!canSubmit}
          onPress={submit}
        />
      </View>
    </View>
  );
}
