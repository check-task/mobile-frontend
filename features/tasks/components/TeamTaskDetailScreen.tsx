import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";
import { DeleteConfirmModalContent } from "@/components/common/DeleteConfirmModalContent/DeleteConfirmModalContent";
import { DropdownMenu } from "@/components/common/DropdownMenu/DropdownMenu";
import { Tabs } from "@/components/common/Tabs/Tabs";
import { STRONG_CARD_SHADOW } from "@/constants/shadows";
import { useModal } from "@/hooks/useModal";
import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";
import { emitWithAck } from "@/lib/socket/socketClient";

import type { TaskDetail } from "../api/taskMapper";
import type { AddSubTaskRequest, TaskMember } from "../api/task.types";
import { useMyUserIdQuery } from "../hooks/useMyUserIdQuery";
import { useRemoveTaskMemberMutation } from "../hooks/useRemoveTaskMemberMutation";
import { useResourceActions } from "../hooks/useResourceActions";
import { useSubTaskAddForm } from "../hooks/useSubTaskAddForm";
import { useSubTaskToggle } from "../hooks/useSubTaskToggle";
import { useTaskDetailQuery } from "../hooks/useTaskDetailQuery";
import { useTaskMembersQuery } from "../hooks/useTaskMembersQuery";
import { useTaskRoom } from "../hooks/useTaskRoom";
import { ResourceSection } from "./ResourceSection";
import { SubTaskList } from "./SubTaskList";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TaskDetailStatus } from "./TaskDetailStatus";
import { TeamMemberSection } from "./TeamMemberSection";
import { TeamSubTaskDetail } from "./TeamSubTaskDetail";

const RESOURCE_TABS = ["커뮤니케이션", "회의록", "자료"] as const;

function toMemberRole(member: TaskMember, myUserId: number | undefined) {
  const role = member.role === "owner" ? "Owner" : "member";
  return member.id === myUserId ? `${role}(you)` : role;
}

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
  const { showToast } = useToast();
  const { data: members = [] } = useTaskMembersQuery(taskId);
  const { data: myUserId } = useMyUserIdQuery();
  const [assigneeMenuId, setAssigneeMenuId] = useState<string | null>(null);
  const [memberMenuId, setMemberMenuId] = useState<number | null>(null);
  const { openModal, closeModal } = useModal();
  const removeMemberMutation = useRemoveTaskMemberMutation(taskId);
  const isOwner = members.some(
    (member) => member.id === myUserId && member.role === "owner"
  );
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

  // 서버는 보낸 목록으로 담당자를 통째로 바꾸므로, 누른 팀원을 넣거나 뺀 전체 목록을 보낸다.
  const toggleAssignee = (subTaskId: string, userId: number) => {
    setAssigneeMenuId(null);
    const current = (detail.subTaskExtras[subTaskId]?.assignees ?? []).map(
      (assignee) => Number(assignee.id)
    );
    const assigneeIds = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    emitWithAck("setSubTaskAssignee", {
      taskId,
      subTaskId: Number(subTaskId),
      assigneeIds,
    }).catch((error: unknown) =>
      showToast("fail", getErrorMessage(error, "담당자를 바꾸지 못했어요."))
    );
  };

  const makeOwner = (member: TaskMember) => {
    setMemberMenuId(null);
    emitWithAck("member:update", {
      taskId,
      userId: myUserId,
      targetUserId: member.id,
      role: 0,
    }).catch((error: unknown) =>
      showToast("fail", getErrorMessage(error, "팀장을 바꾸지 못했어요."))
    );
  };

  const confirmRemoveMember = (member: TaskMember) => {
    setMemberMenuId(null);
    openModal({
      title: "팀원 삭제",
      children: (
        <DeleteConfirmModalContent
          targetName={member.nickname}
          description="삭제된 팀원은 이 과제에서 나가게 됩니다."
          cancelFirst
          onConfirm={() => {
            closeModal();
            removeMemberMutation.mutate(member.id, {
              onError: (error) =>
                showToast(
                  "fail",
                  getErrorMessage(error, "팀원을 삭제하지 못했어요.")
                ),
            });
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

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
                onAssigneePress={() =>
                  setAssigneeMenuId((current) =>
                    current === item.id ? null : item.id
                  )
                }
                assigneeMenu={
                  assigneeMenuId === item.id ? (
                    <DropdownMenu
                      items={members.map((member) => ({
                        key: String(member.id),
                        label:
                          member.id === myUserId
                            ? `${member.nickname}(you)`
                            : member.nickname,
                        leading: (
                          <View className="h-4 w-4 rounded-full bg-blue-100" />
                        ),
                      }))}
                      onSelect={(key) => toggleAssignee(item.id, Number(key))}
                    />
                  ) : undefined
                }
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
        <TeamMemberSection
          members={members.map((member) => {
            const canManage = isOwner && member.id !== myUserId;
            return {
              id: String(member.id),
              name: member.nickname,
              role: toMemberRole(member, myUserId),
              onRolePress: canManage
                ? () =>
                    setMemberMenuId((current) =>
                      current === member.id ? null : member.id
                    )
                : undefined,
              menu:
                canManage && memberMenuId === member.id ? (
                  <DropdownMenu
                    variant="leader"
                    items={[
                      { key: "owner", label: "팀장 설정" },
                      { key: "remove", label: "팀원 삭제" },
                    ]}
                    onSelect={(key) =>
                      key === "owner"
                        ? makeOwner(member)
                        : confirmRemoveMember(member)
                    }
                  />
                ) : undefined,
            };
          })}
        />
      </View>
    </ScrollView>
  );
}
