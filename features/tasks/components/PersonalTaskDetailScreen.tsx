import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";

import type { TaskDetail } from "../api/taskMapper";
import { useAddSubTaskMutation } from "../hooks/useAddSubTaskMutation";
import { useResourceActions } from "../hooks/useResourceActions";
import { useSubTaskAddForm } from "../hooks/useSubTaskAddForm";
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
  const [subTasks, setSubTasks] = useState(detail.subTasks);
  const [syncedSubTasks, setSyncedSubTasks] = useState(detail.subTasks);
  // 다시 불러온 데이터로 목록을 맞춘다 (effect 안 setState 는 린트가 막는다)
  if (syncedSubTasks !== detail.subTasks) {
    setSyncedSubTasks(detail.subTasks);
    setSubTasks(detail.subTasks);
  }
  const { resources, editResource, deleteResource } = useResourceActions(
    detail.references
  );
  const addSubTaskMutation = useAddSubTaskMutation(taskId);
  const addForm = useSubTaskAddForm({
    taskDeadline: detail.deadline,
    submit: addSubTaskMutation.mutateAsync,
  });

  const doneCount = subTasks.filter((subTask) => subTask.done).length;
  const percent =
    subTasks.length === 0 ? 0 : (doneCount / subTasks.length) * 100;

  const toggleDone = (id: string) => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, done: !subTask.done } : subTask
      )
    );
  };

  const toggleAlarm = (id: string) => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, alarm: !subTask.alarm } : subTask
      )
    );
  };

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
          onToggle={toggleDone}
          onAlarmPress={toggleAlarm}
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
