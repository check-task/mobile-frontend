import { useQueryClient } from "@tanstack/react-query";
import { setStringAsync } from "expo-clipboard";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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

import {
  createInviteCode,
  createReference,
  taskKeys,
  updateReference,
} from "../api/taskApi";
import type { ResourceDraft } from "../api/taskForm.types";
import {
  type TaskDetail,
  toReferenceParams,
  toImageUrl,
  toServerDate,
  toUpdateReferenceParams,
} from "../api/taskMapper";
import type { AddSubTaskRequest, TaskMember } from "../api/task.types";
import { useMyUserIdQuery } from "../hooks/useMyUserIdQuery";
import { useRemoveTaskMemberMutation } from "../hooks/useRemoveTaskMemberMutation";
import { useResourceModals } from "../hooks/useResourceModals";
import { useSubTaskAddForm } from "../hooks/useSubTaskAddForm";
import { useSubTaskToggle } from "../hooks/useSubTaskToggle";
import { useTaskDetailQuery } from "../hooks/useTaskDetailQuery";
import { useTaskMembersQuery } from "../hooks/useTaskMembersQuery";
import { useTaskRoom } from "../hooks/useTaskRoom";
import { ResourceSection } from "./ResourceSection";
import { SubTaskList } from "./SubTaskList";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { MemberAvatar } from "./MemberAvatar";
import { type AnchorRect, MenuPopover } from "./MenuPopover";
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
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const {
    data: members = [],
    isError: isMembersError,
    refetch: refetchMembers,
  } = useTaskMembersQuery(taskId);
  const { data: myUserId } = useMyUserIdQuery();
  const [assigneeMenu, setAssigneeMenu] = useState<{
    subTaskId: string;
    anchor: AnchorRect;
  } | null>(null);
  const [savingAssigneeIds, setSavingAssigneeIds] = useState<readonly string[]>(
    []
  );
  const [memberMenu, setMemberMenu] = useState<{
    member: TaskMember;
    anchor: AnchorRect;
  } | null>(null);
  const { openModal, closeModal } = useModal();
  const removeMemberMutation = useRemoveTaskMemberMutation(taskId);
  const isOwner = members.some(
    (member) => member.id === myUserId && member.role === "owner"
  );
  const queryClient = useQueryClient();
  const emitAndRefresh = async (event: string, payload: unknown) => {
    await emitWithAck(event, payload);
    await queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
  };
  const addForm = useSubTaskAddForm({
    taskDeadline: detail.deadline,
    submit: (data: AddSubTaskRequest) =>
      emitWithAck("subtask:create", { taskId, data }),
  });
  const resourceModals = useResourceModals();
  const [expandedIds, setExpandedIds] = useState<readonly string[]>([]);
  const [resourceTab, setResourceTab] =
    useState<(typeof RESOURCE_TABS)[number]>("커뮤니케이션");
  const [commentDrafts, setCommentDrafts] = useState<
    Readonly<Record<string, string>>
  >({});
  // 세부 과제별로 수정 중인 댓글 id. 있으면 전송이 새 댓글 대신 그 댓글을 고친다.
  const [editingCommentIds, setEditingCommentIds] = useState<
    Readonly<Record<string, string>>
  >({});
  const [sendingCommentIds, setSendingCommentIds] = useState<readonly string[]>(
    []
  );
  // 세부 과제별 입력 변경 횟수. 전송이 끝났을 때 그 사이 새로 입력했으면 지우지 않으려고 센다.
  const draftVersionsRef = useRef<Record<string, number>>({});
  const bumpDraftVersion = (subTaskId: string) => {
    draftVersionsRef.current[subTaskId] =
      (draftVersionsRef.current[subTaskId] ?? 0) + 1;
  };
  const [commentMenu, setCommentMenu] = useState<{
    subTaskId: string;
    commentId: string;
    anchor: AnchorRect;
  } | null>(null);

  const doneToggle = useSubTaskToggle({
    taskId,
    field: "done",
    submit: (subTaskId, done) =>
      emitAndRefresh("updateSubtaskStatus", {
        taskId,
        subTaskId,
        status: done ? "COMPLETED" : "PENDING",
      }),
    failMessage: "완료 상태를 바꾸지 못했어요.",
  });
  const alarmToggle = useSubTaskToggle({
    taskId,
    field: "alarm",
    submit: (subTaskId, isAlarm) =>
      emitAndRefresh("subtask:update", {
        taskId,
        data: [{ subTaskId, isAlarm }],
      }),
    failMessage: "알림 설정을 바꾸지 못했어요.",
  });
  const subTasks = alarmToggle.apply(doneToggle.apply(detail.subTasks));

  const doneCount = subTasks.filter((subTask) => subTask.done).length;
  const percent =
    subTasks.length === 0 ? 0 : (doneCount / subTasks.length) * 100;

  // 서버는 보낸 목록으로 담당자를 통째로 바꾸므로, 누른 팀원을 넣거나 뺀 전체 목록을 보낸다.
  // 저장하고 상세를 다시 받아 올 때까지 그 세부 과제의 메뉴를 막아, 다음 선택이 예전 목록으로 만들어지지 않게 한다.
  const toggleAssignee = (subTaskId: string, userId: number) => {
    setAssigneeMenu(null);
    const current = (detail.subTaskExtras[subTaskId]?.assignees ?? []).map(
      (assignee) => Number(assignee.id)
    );
    const assigneeIds = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    setSavingAssigneeIds((ids) => [...ids, subTaskId]);
    emitAndRefresh("setSubTaskAssignee", {
      taskId,
      subTaskId: Number(subTaskId),
      assigneeIds,
    })
      .catch((error: unknown) =>
        showToast("fail", getErrorMessage(error, "담당자를 바꾸지 못했어요."))
      )
      .finally(() =>
        setSavingAssigneeIds((ids) => ids.filter((id) => id !== subTaskId))
      );
  };

  const makeOwner = (member: TaskMember) => {
    setMemberMenu(null);
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
    setMemberMenu(null);
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

  const refreshDetail = () =>
    queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });

  // URL 자료는 소켓으로 보내 팀원에게 바로 알린다. 파일 자료는 소켓이 지원하지 않아 REST 로 보낸다.
  const saveReference = async (draft: ResourceDraft, referenceId?: string) => {
    if (draft.type === "url") {
      await (referenceId
        ? emitAndRefresh("reference:update", {
            taskId,
            referenceId: Number(referenceId),
            name: draft.name,
            url: draft.path,
          })
        : emitAndRefresh("reference:create", {
            taskId,
            type: "url",
            item: { name: draft.name, url: draft.path },
          }));
      return;
    }
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

  const resourceTabs = {
    커뮤니케이션: {
      items: detail.communications,
      add: () =>
        resourceModals.openCommunication((value) =>
          emitAndRefresh("communication:create", { taskId, ...value })
        ),
      edit: (id: string) => {
        const item = detail.communications.find((it) => it.id === id);
        if (!item) return;
        resourceModals.openCommunication(
          (value) =>
            emitAndRefresh("communication:update", {
              taskId,
              communicationId: Number(id),
              ...value,
            }),
          { name: item.title, url: item.link }
        );
      },
      remove: (id: string) => {
        const item = detail.communications.find((it) => it.id === id);
        if (!item) return;
        resourceModals.confirmDelete("커뮤니케이션", item.title, () =>
          emitAndRefresh("communication:delete", {
            taskId,
            communicationId: Number(id),
          })
        );
      },
    },
    회의록: {
      items: detail.meetingLogs,
      add: () => {
        const today = new Date();
        resourceModals.openMeetingLog(today, (value) =>
          emitAndRefresh("log:create", {
            taskId,
            date: toServerDate(today),
            ...value,
          })
        );
      },
      edit: (id: string) => {
        const log = detail.meetingLogValues[id];
        if (!log) return;
        resourceModals.openMeetingLog(
          log.date,
          (value) =>
            emitAndRefresh("log:update", {
              taskId,
              logId: Number(id),
              ...value,
            }),
          log
        );
      },
      remove: (id: string) => {
        const item = detail.meetingLogs.find((it) => it.id === id);
        if (!item) return;
        resourceModals.confirmDelete("회의록", item.title, () =>
          emitAndRefresh("log:delete", { taskId, logId: Number(id) })
        );
      },
    },
    자료: {
      items: detail.references,
      add: () => resourceModals.openReference((draft) => saveReference(draft)),
      edit: (id: string) =>
        resourceModals.openReference(
          (draft) => saveReference(draft, id),
          detail.referenceDrafts[id]
        ),
      remove: (id: string) => {
        const item = detail.references.find((it) => it.id === id);
        if (!item) return;
        resourceModals.confirmDelete("자료", item.title, () =>
          emitAndRefresh("reference:delete", {
            taskId,
            referenceId: Number(id),
          })
        );
      },
    },
  };
  const currentResourceTab = resourceTabs[resourceTab];

  const copyInviteCode = () =>
    createInviteCode(taskId)
      .then(({ invite_code }) => setStringAsync(invite_code))
      .then((copied) =>
        copied
          ? showToast("success", "팀 과제 초대코드가 복사되었습니다.")
          : showToast("fail", "초대코드를 복사하지 못했어요.")
      )
      .catch((error: unknown) =>
        showToast(
          "fail",
          getErrorMessage(error, "초대코드를 복사하지 못했어요.")
        )
      );

  const changeCommentDraft = (id: string, draft: string) => {
    bumpDraftVersion(id);
    setCommentDrafts((current) => ({ ...current, [id]: draft }));
    // 입력을 다 지우면 수정을 그만둔 것으로 본다.
    if (draft.length === 0) {
      setEditingCommentIds(({ [id]: _cancelled, ...rest }) => rest);
    }
  };

  const sendComment = (subTaskId: string) => {
    const content = (commentDrafts[subTaskId] ?? "").trim();
    if (content.length === 0 || sendingCommentIds.includes(subTaskId)) {
      return;
    }
    const editingId = editingCommentIds[subTaskId];
    const sentVersion = draftVersionsRef.current[subTaskId] ?? 0;
    setSendingCommentIds((ids) => [...ids, subTaskId]);
    const request = editingId
      ? emitAndRefresh("comment:update", {
          taskId,
          subTaskId: Number(subTaskId),
          commentId: Number(editingId),
          content,
        })
      : emitAndRefresh("comment:create", {
          taskId,
          subTaskId: Number(subTaskId),
          content,
        });
    request
      .then(() => {
        if ((draftVersionsRef.current[subTaskId] ?? 0) === sentVersion) {
          changeCommentDraft(subTaskId, "");
        }
      })
      .catch((error: unknown) =>
        showToast(
          "fail",
          getErrorMessage(
            error,
            editingId
              ? "댓글을 수정하지 못했어요."
              : "댓글을 등록하지 못했어요."
          )
        )
      )
      .finally(() =>
        setSendingCommentIds((ids) => ids.filter((id) => id !== subTaskId))
      );
  };

  const startEditComment = (subTaskId: string, commentId: string) => {
    setCommentMenu(null);
    const comment = detail.subTaskExtras[subTaskId]?.comments.find(
      (item) => item.id === commentId
    );
    if (!comment) {
      return;
    }
    bumpDraftVersion(subTaskId);
    setEditingCommentIds((current) => ({ ...current, [subTaskId]: commentId }));
    setCommentDrafts((current) => ({ ...current, [subTaskId]: comment.body }));
  };

  const deleteComment = (subTaskId: string, commentId: string) => {
    setCommentMenu(null);
    // 수정 중이던 댓글을 지운 경우에만 수정 상태와 입력을 정리한다. 그 사이 새로 입력했으면 두는 건 전송과 같다.
    const wasEditing = editingCommentIds[subTaskId] === commentId;
    const sentVersion = draftVersionsRef.current[subTaskId] ?? 0;
    emitAndRefresh("comment:delete", {
      taskId,
      subTaskId: Number(subTaskId),
      commentId: Number(commentId),
    })
      .then(() => {
        if (
          wasEditing &&
          (draftVersionsRef.current[subTaskId] ?? 0) === sentVersion
        ) {
          changeCommentDraft(subTaskId, "");
        }
      })
      .catch((error: unknown) =>
        showToast("fail", getErrorMessage(error, "댓글을 삭제하지 못했어요."))
      );
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
          cardShadow={STRONG_CARD_SHADOW}
          onToggle={(id) => doneToggle.toggle(subTasks, id)}
          onAlarmPress={(id) => alarmToggle.toggle(subTasks, id)}
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
                onSendComment={() => sendComment(item.id)}
                onCommentMenuPress={(commentId, anchor) =>
                  setCommentMenu({ subTaskId: item.id, commentId, anchor })
                }
                onAssigneePress={
                  savingAssigneeIds.includes(item.id)
                    ? undefined
                    : (anchor) =>
                        setAssigneeMenu({ subTaskId: item.id, anchor })
                }
              />
            );
          }}
        />
        <ResourceSection
          items={currentResourceTab.items}
          addLabel={`${resourceTab} 추가`}
          onAddPress={currentResourceTab.add}
          onEdit={currentResourceTab.edit}
          onDelete={currentResourceTab.remove}
          tabs={
            <Tabs
              items={RESOURCE_TABS}
              value={resourceTab}
              onChange={setResourceTab}
            />
          }
        />
        <TeamMemberSection
          onInvitePress={copyInviteCode}
          onRetry={isMembersError ? () => refetchMembers() : undefined}
          members={members.map((member) => {
            const canManage = isOwner && member.id !== myUserId;
            return {
              id: String(member.id),
              name: member.nickname,
              avatarUrl: toImageUrl(member.profileImage),
              role: toMemberRole(member, myUserId),
              onRolePress: canManage
                ? (anchor: AnchorRect) => setMemberMenu({ member, anchor })
                : undefined,
            };
          })}
        />
      </View>
      <MenuPopover
        anchor={assigneeMenu?.anchor ?? null}
        align="left"
        onClose={() => setAssigneeMenu(null)}
      >
        <DropdownMenu
          items={members.map((member) => ({
            key: String(member.id),
            label:
              member.id === myUserId
                ? `${member.nickname}(you)`
                : member.nickname,
            leading: (
              <MemberAvatar
                uri={toImageUrl(member.profileImage)}
                className="h-4 w-4 bg-blue-100"
              />
            ),
          }))}
          onSelect={(key) =>
            assigneeMenu && toggleAssignee(assigneeMenu.subTaskId, Number(key))
          }
        />
      </MenuPopover>
      <MenuPopover
        anchor={commentMenu?.anchor ?? null}
        align="right"
        onClose={() => setCommentMenu(null)}
      >
        <DropdownMenu
          variant="comment"
          items={[
            { key: "edit", label: "댓글 수정" },
            { key: "delete", label: "댓글 삭제" },
          ]}
          onSelect={(key) => {
            if (!commentMenu) {
              return;
            }
            if (key === "edit") {
              startEditComment(commentMenu.subTaskId, commentMenu.commentId);
            } else {
              deleteComment(commentMenu.subTaskId, commentMenu.commentId);
            }
          }}
        />
      </MenuPopover>
      <MenuPopover
        anchor={memberMenu?.anchor ?? null}
        align="right"
        onClose={() => setMemberMenu(null)}
      >
        <DropdownMenu
          variant="leader"
          items={[
            { key: "owner", label: "팀장 설정" },
            { key: "remove", label: "팀원 삭제" },
          ]}
          onSelect={(key) => {
            if (!memberMenu) {
              return;
            }
            if (key === "owner") {
              makeOwner(memberMenu.member);
            } else {
              confirmRemoveMember(memberMenu.member);
            }
          }}
        />
      </MenuPopover>
    </ScrollView>
  );
}
