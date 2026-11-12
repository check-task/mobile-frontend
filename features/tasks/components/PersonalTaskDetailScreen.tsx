import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BackHeader } from "@/components/common/Header/BackHeader";

import { type Resource, ResourceSection } from "./ResourceSection";
import { SubTaskAddForm } from "./SubTaskAddForm";
import { SubTaskList } from "./SubTaskList";
import type { SubTask } from "./SubTaskRow";
import { TaskDetailHeader } from "./TaskDetailHeader";

const INITIAL_SUB_TASKS: readonly SubTask[] = [
  {
    id: "1",
    title: "프로젝트 세팅",
    dueDate: "25.10.19",
    done: true,
    alarm: false,
  },
  {
    id: "2",
    title: "주제 정하기",
    dueDate: "25.10.22",
    done: true,
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

const RESOURCES: readonly Resource[] = [
  { id: "1", title: "자료명", link: "경로" },
  { id: "2", title: "자료명", link: "파일명" },
];

const SCROLL_BOTTOM_GAP = 32;
const ADD_FORM_DUE_DATE = "25.10.19";

export function PersonalTaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [subTasks, setSubTasks] = useState(INITIAL_SUB_TASKS);
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

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

  const closeForm = () => {
    setIsAdding(false);
    setDraftTitle("");
  };

  const saveSubTask = () => {
    const title = draftTitle.trim();
    if (title.length === 0) {
      return;
    }
    setSubTasks((current) => [
      ...current,
      {
        id: String(current.length + 1),
        title,
        dueDate: ADD_FORM_DUE_DATE,
        done: false,
        alarm: true,
      },
    ]);
    closeForm();
  };

  const toggleAlarm = (id: string) => {
    setSubTasks((current) =>
      current.map((subTask) =>
        subTask.id === id ? { ...subTask, alarm: !subTask.alarm } : subTask
      )
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
            onToggle={toggleDone}
            onAlarmPress={toggleAlarm}
            onAddPress={() => setIsAdding(true)}
            addForm={
              isAdding ? (
                <SubTaskAddForm
                  title={draftTitle}
                  onChangeTitle={setDraftTitle}
                  dueDate={ADD_FORM_DUE_DATE}
                  onCancel={closeForm}
                  onSave={saveSubTask}
                />
              ) : undefined
            }
          />
          <ResourceSection items={RESOURCES} />
        </View>
      </ScrollView>
    </View>
  );
}
