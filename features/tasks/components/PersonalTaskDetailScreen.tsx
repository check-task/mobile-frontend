import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";
import { useToast } from "@/hooks/useToast";
import { type DueDate, toDueDateTime } from "@/lib/dueDate";
import { getErrorMessage } from "@/lib/errorMessage";

import {
  createReference,
  deleteReference,
  taskKeys,
  updateReference,
  updateSubTaskDeadline,
} from "../api/taskApi";
import type { ResourceDraft } from "../api/taskForm.types";
import {
  type TaskDetail,
  toReferenceParams,
  toUpdateReferenceParams,
} from "../api/taskMapper";
import { useAddSubTaskMutation } from "../hooks/useAddSubTaskMutation";
import { useResourceModals } from "../hooks/useResourceModals";
import { useSubTaskAddForm } from "../hooks/useSubTaskAddForm";
import { useSubTaskToggle } from "../hooks/useSubTaskToggle";
import { useUpdateSubTaskAlarmMutation } from "../hooks/useUpdateSubTaskAlarmMutation";
import { useUpdateSubTaskStatusMutation } from "../hooks/useUpdateSubTaskStatusMutation";
import { useTaskDetailQuery } from "../hooks/useTaskDetailQuery";
import { ResourceSection } from "./ResourceSection";
import { SubTaskList } from "./SubTaskList";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TaskDetailStatus } from "./TaskDetailStatus";

const SCROLL_BOTTOM_GAP = 32;
const SUB_TASK_COLLAPSED_COUNT = 6;
const RESOURCE_COLLAPSED_COUNT = 2;

export function PersonalTaskDetailScreen({ taskId }: { taskId: number }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isError, refetch } = useTaskDetailQuery(taskId);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <BackHeader onBack={() => router.back()} />
      {data ? (
        <PersonalTaskDetailContent taskId={taskId} detail={data} />
      ) : (
        <TaskDetailStatus isError={isError} onRetry={refetch} />
      )}
    </View>
  );
}

function PersonalTaskDetailContent({
  taskId,
  detail,
}: {
  taskId: number;
  detail: TaskDetail;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const resourceModals = useResourceModals();
  const { showToast } = useToast();
  const refreshDetail = () =>
    queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });

  const changeSubTaskDeadline = async (id: string, value: DueDate | null) => {
    try {
      await updateSubTaskDeadline(
        Number(id),
        value ? toDueDateTime(value).toISOString() : null
      );
      await refreshDetail();
    } catch (error) {
      showToast("fail", getErrorMessage(error, "마감일을 바꾸지 못했어요."));
    }
  };

  const saveReference = async (draft: ResourceDraft, referenceId?: string) => {
    if (referenceId) {
      await updateReference(
        taskId,
        Number(referenceId),
        toUpdateReferenceParams(draft)
      );
    } else {
      const params = toReferenceParams(draft);
      if (!params) {
        throw new Error("파일을 선택해 주세요.");
      }
      await createReference(taskId, params);
    }
    await refreshDetail();
  };

  const removeReference = (id: string) => {
    const item = detail.references.find((it) => it.id === id);
    if (!item) return;
    resourceModals.confirmDelete("자료", item.title, async () => {
      await deleteReference(taskId, Number(id));
      await refreshDetail();
    });
  };
  const addSubTaskMutation = useAddSubTaskMutation(taskId);
  const addForm = useSubTaskAddForm({
    taskDeadline: detail.deadline,
    submit: addSubTaskMutation.mutateAsync,
  });

  const updateStatusMutation = useUpdateSubTaskStatusMutation(taskId);
  const updateAlarmMutation = useUpdateSubTaskAlarmMutation(taskId);
  const doneToggle = useSubTaskToggle({
    taskId,
    field: "done",
    submit: (subTaskId, done) =>
      updateStatusMutation.mutateAsync({
        subTaskId,
        status: done ? "COMPLETED" : "PENDING",
      }),
    failMessage: "완료 상태를 바꾸지 못했어요.",
  });
  const alarmToggle = useSubTaskToggle({
    taskId,
    field: "alarm",
    submit: (subTaskId, isAlarm) =>
      updateAlarmMutation.mutateAsync({ subTaskId, isAlarm }),
    failMessage: "알림 설정을 바꾸지 못했어요.",
  });
  const subTasks = alarmToggle.apply(doneToggle.apply(detail.subTasks));

  const doneCount = subTasks.filter((subTask) => subTask.done).length;
  const percent =
    subTasks.length === 0 ? 0 : (doneCount / subTasks.length) * 100;

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-5 px-4 pt-5"
      contentContainerStyle={{
        paddingBottom: insets.bottom + SCROLL_BOTTOM_GAP,
      }}
    >
      <TaskDetailHeader
        folderColor={detail.folderColor}
        dday={detail.dday}
        title={detail.title}
        percent={percent}
        onEditPress={() =>
          router.push({
            pathname: "/tasks/[taskId]/edit",
            params: { taskId: String(taskId) },
          })
        }
      />
      <View className="h-px bg-gray-200" />
      <View className="gap-7">
        <SubTaskList
          items={subTasks}
          collapsedCount={SUB_TASK_COLLAPSED_COUNT}
          onToggle={(id) => doneToggle.toggle(subTasks, id)}
          onAlarmPress={(id) => alarmToggle.toggle(subTasks, id)}
          onDueDateChange={changeSubTaskDeadline}
          maxDate={
            detail.deadline ? { date: detail.deadline, hasTime: true } : null
          }
          onAddPress={addForm.open}
          addForm={addForm.form}
        />
        <ResourceSection
          items={detail.references}
          onAddPress={() =>
            resourceModals.openReference((draft) => saveReference(draft))
          }
          onEdit={(id) =>
            resourceModals.openReference(
              (draft) => saveReference(draft, id),
              detail.referenceDrafts[id]
            )
          }
          onDelete={removeReference}
          collapsedCount={RESOURCE_COLLAPSED_COUNT}
        />
      </View>
    </ScrollView>
  );
}
