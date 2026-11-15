import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";

import type { TaskDetail } from "../api/taskMapper";
import { useAddSubTaskMutation } from "../hooks/useAddSubTaskMutation";
import { useResourceActions } from "../hooks/useResourceActions";
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
  const insets = useSafeAreaInsets();
  const { resources, editResource, deleteResource } = useResourceActions(
    detail.references
  );
  const addSubTaskMutation = useAddSubTaskMutation(taskId);
  const addForm = useSubTaskAddForm({
    taskDeadline: detail.deadline,
    submit: addSubTaskMutation.mutateAsync,
  });

  const updateStatusMutation = useUpdateSubTaskStatusMutation(taskId);
  const updateAlarmMutation = useUpdateSubTaskAlarmMutation(taskId);
  const doneToggle = useSubTaskToggle({
    field: "done",
    submit: (subTaskId, done) =>
      updateStatusMutation.mutateAsync({
        subTaskId,
        status: done ? "COMPLETED" : "PENDING",
      }),
    failMessage: "완료 상태를 바꾸지 못했어요.",
  });
  const alarmToggle = useSubTaskToggle({
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
      />
      <View className="h-px bg-gray-200" />
      <View className="gap-7">
        <SubTaskList
          items={subTasks}
          collapsedCount={SUB_TASK_COLLAPSED_COUNT}
          onToggle={(id) => doneToggle.toggle(subTasks, id)}
          onAlarmPress={(id) => alarmToggle.toggle(subTasks, id)}
          onAddPress={addForm.open}
          addForm={addForm.form}
        />
        <ResourceSection
          items={resources}
          onEdit={editResource}
          onDelete={deleteResource}
          collapsedCount={RESOURCE_COLLAPSED_COUNT}
        />
      </View>
    </ScrollView>
  );
}
