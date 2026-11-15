import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";
import { Tabs } from "@/components/common/Tabs/Tabs";
import { STRONG_CARD_SHADOW } from "@/constants/shadows";
import { emitWithAck } from "@/lib/socket/socketClient";

import type { TaskDetail } from "../api/taskMapper";
import type { AddSubTaskRequest } from "../api/task.types";
import { useResourceActions } from "../hooks/useResourceActions";
import { useSubTaskAddForm } from "../hooks/useSubTaskAddForm";
import { useSubTaskToggle } from "../hooks/useSubTaskToggle";
import { useTaskDetailQuery } from "../hooks/useTaskDetailQuery";
import { useTaskRoom } from "../hooks/useTaskRoom";
import { ResourceSection } from "./ResourceSection";
import { SubTaskList } from "./SubTaskList";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TaskDetailStatus } from "./TaskDetailStatus";
import { TeamMemberSection } from "./TeamMemberSection";
import { TeamSubTaskDetail } from "./TeamSubTaskDetail";

const RESOURCE_TABS = ["커뮤니케이션", "회의록", "자료"] as const;

// 팀원 목록 API 연결 전까지 사용
const MEMBERS = [
  { id: "1", name: "닉네임", role: "Owner" },
  { id: "2", name: "닉네임", role: "member(you)" },
  { id: "3", name: "닉네임", role: "member" },
] as const;

const SCROLL_BOTTOM_GAP = 32;
const VISIBLE_ASSIGNEE_COUNT = 3;

export function TeamTaskDetailScreen({ taskId }: { taskId: number }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isError, refetch } = useTaskDetailQuery(taskId);
  useTaskRoom(taskId);

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <BackHeader onBack={() => router.back()} />
      {data ? (
        <TeamTaskDetailContent taskId={taskId} detail={data} />
      ) : (
        <TaskDetailStatus isError={isError} onRetry={refetch} />
      )}
    </View>
  );
}

function TeamTaskDetailContent({
  taskId,
  detail,
}: {
  taskId: number;
  detail: TaskDetail;
}) {
  const insets = useSafeAreaInsets();
  const [subTasks, setSubTasks] = useState(detail.subTasks);
  const [syncedSubTasks, setSyncedSubTasks] = useState(detail.subTasks);
  // 팀원이 바꿔 다시 불러온 데이터로 목록을 맞춘다 (effect 안 setState 는 린트가 막는다)
  if (syncedSubTasks !== detail.subTasks) {
    setSyncedSubTasks(detail.subTasks);
    setSubTasks(detail.subTasks);
  }
  const addForm = useSubTaskAddForm({
    taskDeadline: detail.deadline,
    submit: (data: AddSubTaskRequest) =>
      emitWithAck("subtask:create", { taskId, data }),
  });
  const resourceActions = {
    커뮤니케이션: useResourceActions(detail.communications),
    회의록: useResourceActions(detail.meetingLogs),
    자료: useResourceActions(detail.references),
  };
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([]);
  const [resourceTab, setResourceTab] =
    useState<(typeof RESOURCE_TABS)[number]>("커뮤니케이션");
  const [commentDrafts, setCommentDrafts] = useState<
    Readonly<Record<string, string>>
  >({});
  const { resources, editResource, deleteResource } =
    resourceActions[resourceTab];

  const toggleDone = useSubTaskToggle({
    subTasks,
    setSubTasks,
    field: "done",
    submit: (subTaskId, done) =>
      emitWithAck("updateSubtaskStatus", {
        taskId,
        subTaskId,
        status: done ? "COMPLETED" : "PENDING",
      }),
    failMessage: "완료 상태를 바꾸지 못했어요.",
  });
  const toggleAlarm = useSubTaskToggle({
    subTasks,
    setSubTasks,
    field: "alarm",
    submit: (subTaskId, isAlarm) =>
      emitWithAck("subtask:update", {
        taskId,
        data: [{ subTaskId, isAlarm }],
      }),
    failMessage: "알림 설정을 바꾸지 못했어요.",
  });

  const doneCount = subTasks.filter((subTask) => subTask.done).length;
  const percent =
    subTasks.length === 0 ? 0 : (doneCount / subTasks.length) * 100;

  const changeCommentDraft = (id: string, draft: string) => {
    setCommentDrafts((current) => ({ ...current, [id]: draft }));
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((current) =>
      current.includes(id)
        ? current.filter((expandedId) => expandedId !== id)
        : [...current, id]
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
          cardShadow={STRONG_CARD_SHADOW}
          onToggle={toggleDone}
          onAlarmPress={toggleAlarm}
          onAddPress={addForm.open}
          addForm={addForm.form}
          expandedIds={expandedIds}
          onExpandPress={toggleExpanded}
          renderExpanded={(item) => {
            const extra = detail.subTaskExtras[item.id];
            const assignees = extra?.assignees ?? [];
            return (
              <TeamSubTaskDetail
                assignees={assignees.slice(0, VISIBLE_ASSIGNEE_COUNT)}
                extraAssigneeCount={Math.max(
                  assignees.length - VISIBLE_ASSIGNEE_COUNT,
                  0
                )}
                comments={extra?.comments ?? []}
                commentDraft={commentDrafts[item.id] ?? ""}
                onChangeCommentDraft={(draft) =>
                  changeCommentDraft(item.id, draft)
                }
                onSendComment={() => changeCommentDraft(item.id, "")}
              />
            );
          }}
        />
        <ResourceSection
          items={resources}
          onEdit={editResource}
          onDelete={deleteResource}
          tabs={
            <Tabs
              items={RESOURCE_TABS}
              value={resourceTab}
              onChange={setResourceTab}
            />
          }
        />
        <TeamMemberSection members={MEMBERS} />
      </View>
    </ScrollView>
  );
}
