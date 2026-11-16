import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/components/common/Button/Button";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { BackHeader } from "@/components/common/Header/BackHeader";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { TaskFormValue } from "../api/taskForm.types";

import { useDeleteTaskMutation } from "../hooks/useDeleteTaskMutation";
import { useMyUserIdQuery } from "../hooks/useMyUserIdQuery";
import { useTaskMembersQuery } from "../hooks/useTaskMembersQuery";
import { useTaskFormValueQuery } from "../hooks/useTaskFormValueQuery";
import { useUpdateTaskMutation } from "../hooks/useUpdateTaskMutation";

import { TaskForm } from "./TaskForm";

export type TaskEditScreenProps = {
  taskId: string;
};

export function TaskEditScreen({ taskId }: TaskEditScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const id = Number(taskId);
  const taskQuery = useTaskFormValueQuery(id);
  const updateTaskMutation = useUpdateTaskMutation();
  const deleteTaskMutation = useDeleteTaskMutation();
  const { data: myUserId } = useMyUserIdQuery();
  const { data: members = [] } = useTaskMembersQuery(id);
  const task = taskQuery.data;

  if (!task) {
    return (
      <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
        <BackHeader onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-600 text-b-02-r">
            {taskQuery.isError
              ? "과제를 불러오지 못했어요."
              : "과제를 불러오는 중..."}
          </Text>
        </View>
      </View>
    );
  }

  const confirmDeleteTask = () => {
    openModal({
      title: "과제 삭제",
      children: (
        <DeleteConfirmModalContent
          targetName={task.title}
          description="삭제된 과제는 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            closeModal();
            deleteTaskMutation.mutate(id, {
              onSuccess: () =>
                router.dismissTo({
                  pathname: "/tasks",
                  params: { scope: task.isTeam ? "team" : "personal" },
                }),
              onError: (error) =>
                showToast(
                  "fail",
                  getErrorMessage(error, "과제를 삭제하지 못했어요.")
                ),
            });
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const save = (value: TaskFormValue) => {
    updateTaskMutation.mutate(
      { taskId: id, initial: task, value },
      {
        onSuccess: ({ failedReferenceCount }) => {
          if (failedReferenceCount > 0) {
            showToast(
              "fail",
              `자료 ${failedReferenceCount}개를 저장하지 못했어요.`
            );
          }
          router.back();
        },
        onError: (error) =>
          showToast(
            "fail",
            getErrorMessage(error, "과제를 저장하지 못했어요.")
          ),
      }
    );
  };

  const isBusy = updateTaskMutation.isPending || deleteTaskMutation.isPending;
  // 팀원이 DELETE 를 부르면 과제 삭제가 아니라 탈퇴가 되므로, 팀 과제는 팀장만 삭제할 수 있게 막는다
  const canDelete =
    !task.isTeam ||
    members.some((member) => member.id === myUserId && member.role === "owner");

  return (
    <TaskForm
      key={taskId}
      heading="과제 수정"
      initialValue={task}
      isEdit
      footer={(value) => (
        <>
          <Button
            label="과제 삭제하기"
            variant="gray"
            disabled={isBusy || !canDelete}
            onPress={confirmDeleteTask}
          />
          <Button
            label={updateTaskMutation.isPending ? "저장 중..." : "저장"}
            disabled={
              value.title.trim().length === 0 ||
              value.deadline === null ||
              isBusy
            }
            onPress={() => save(value)}
          />
        </>
      )}
    />
  );
}
