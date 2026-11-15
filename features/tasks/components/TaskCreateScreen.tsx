import { useRouter } from "expo-router";
import { Platform } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";
import { toDueDateTime } from "@/lib/dueDate";

import type { ResourceDraft, TaskFormValue } from "../api/taskForm.types";

import {
  type CreateTaskInput,
  useCreateTaskMutation,
} from "../hooks/useCreateTaskMutation";

import { TaskForm } from "./TaskForm";

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

export function TaskCreateScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const createTaskMutation = useCreateTaskMutation();

  const submit = ({
    isTeam,
    title,
    folderId,
    deadline,
    subTasks,
    resources,
  }: TaskFormValue) => {
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
    <TaskForm
      heading="과제 등록"
      footer={(value) => (
        <Button
          label={createTaskMutation.isPending ? "등록 중..." : "과제 등록"}
          disabled={
            value.title.trim().length === 0 ||
            value.deadline === null ||
            createTaskMutation.isPending
          }
          onPress={() => submit(value)}
        />
      )}
    />
  );
}
