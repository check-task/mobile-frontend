import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";
import { Tabs } from "@/components/common/Tabs/Tabs";

import { useResourceActions } from "../hooks/useResourceActions";
import { ResourceSection } from "./ResourceSection";
import { SubTaskList } from "./SubTaskList";
import type { SubTask } from "./SubTaskRow";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TeamMemberSection } from "./TeamMemberSection";
import { TeamSubTaskDetail } from "./TeamSubTaskDetail";

const INITIAL_SUB_TASKS: readonly SubTask[] = [
  {
    id: "1",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "2",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "3",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "4",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "5",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "6",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
];

const RESOURCES = [
  { id: "1", title: "자료명", link: "경로" },
  { id: "2", title: "자료명", link: "파일명" },
] as const;

const RESOURCE_TABS = ["커뮤니케이션", "회의록", "자료"] as const;

const ASSIGNEES = [
  { id: "1", name: "송월송송월" },
  { id: "2", name: "송월송송월" },
  { id: "3", name: "송월송송월" },
] as const;

const INITIAL_COMMENTS = [
  {
    id: "1",
    author: "유저명",
    date: "25.10.18",
    time: "13:22",
    body: "Lorem ipsum dolor sit amet consectetur. Netus viverra augue sit sagittis.",
  },
  {
    id: "2",
    author: "유저명",
    date: "25.10.18",
    time: "13:22",
    body: "Lorem ipsum dolor sit amet consectetur.",
  },
] as const;

const MEMBERS = [
  { id: "1", name: "닉네임", role: "Owner" },
  { id: "2", name: "닉네임", role: "member(you)" },
  { id: "3", name: "닉네임", role: "member" },
] as const;

const SCROLL_BOTTOM_GAP = 32;

export function TeamTaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [subTasks, setSubTasks] = useState(INITIAL_SUB_TASKS);
  const { resources, editResource, deleteResource } =
    useResourceActions(RESOURCES);
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(["2"]);
  const [resourceTab, setResourceTab] =
    useState<(typeof RESOURCE_TABS)[number]>("커뮤니케이션");
  const [commentDraft, setCommentDraft] = useState("");

  const doneCount = subTasks.filter((subTask) => subTask.done).length;
  const percent =
    subTasks.length === 0 ? 0 : (doneCount / subTasks.length) * 100;

  const updateSubTask = (id: string, key: "done" | "alarm") => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, [key]: !subTask[key] } : subTask
      )
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
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <BackHeader onBack={() => router.back()} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pt-5"
        contentContainerStyle={{
          paddingBottom: insets.bottom + SCROLL_BOTTOM_GAP,
        }}
      >
        <TaskDetailHeader
          folderColor="sub-01"
          dday="D-3"
          title="과제명"
          percent={percent}
        />
        <View className="h-px bg-gray-200" />
        <View className="gap-7">
          <SubTaskList
            items={subTasks}
            onToggle={(id) => updateSubTask(id, "done")}
            onAlarmPress={(id) => updateSubTask(id, "alarm")}
            expandedIds={expandedIds}
            onExpandPress={toggleExpanded}
            renderExpanded={() => (
              <TeamSubTaskDetail
                assignees={ASSIGNEES}
                extraAssigneeCount={1}
                comments={INITIAL_COMMENTS}
                commentDraft={commentDraft}
                onChangeCommentDraft={setCommentDraft}
                onSendComment={() => setCommentDraft("")}
              />
            )}
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
    </View>
  );
}
