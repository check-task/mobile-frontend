import { useRouter } from "expo-router";

import { Button } from "@/components/common/Button/Button";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { useModal } from "@/hooks/useModal";

import { TaskForm } from "./TaskForm";
import { EDIT_TASK_DUMMY } from "./taskEditData";

export type TaskEditScreenProps = {
  taskId: string;
};

export function TaskEditScreen({ taskId }: TaskEditScreenProps) {
  const router = useRouter();
  const { openModal, closeModal } = useModal();
  // TODO(api): taskId 로 과제 상세를 불러온다
  const task = EDIT_TASK_DUMMY;

  const confirmDeleteTask = () => {
    openModal({
      title: "과제 삭제",
      children: (
        <DeleteConfirmModalContent
          targetName={task.title}
          description="삭제된 과제는 영구 삭제되며, 복구할 수 없습니다."
          onConfirm={() => {
            closeModal();
            // TODO(api): DELETE /task/{taskId}
            router.dismissTo({
              pathname: "/tasks",
              params: { scope: task.isTeam ? "team" : "personal" },
            });
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

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
            onPress={confirmDeleteTask}
          />
          <Button
            label="저장"
            disabled={
              value.title.trim().length === 0 || value.deadline === null
            }
            // TODO(api): PATCH /task/{taskId} 와 세부 과제·자료 변경을 한꺼번에 반영
            onPress={() => router.back()}
          />
        </>
      )}
    />
  );
}
