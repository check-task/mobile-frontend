import { useRef, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { AddSubTaskRequest } from "../api/task.types";
import { type DueDate, toDueDateTime } from "../components/DueDateField";
import { SubTaskAddForm } from "../components/SubTaskAddForm";

type UseSubTaskAddFormParams = {
  taskDeadline: Date | null;
  submit: (body: AddSubTaskRequest) => Promise<unknown>;
};

export function useSubTaskAddForm({
  taskDeadline,
  submit,
}: UseSubTaskAddFormParams) {
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<DueDate | null>(null);
  // 폼을 닫을 때마다 바뀐다. 저장 중에 취소하고 다시 입력했으면 앞선 저장이 끝나도 새 입력을 지우지 않는다.
  const sessionRef = useRef(0);

  const close = () => {
    sessionRef.current += 1;
    setIsAdding(false);
    setTitle("");
    setDueDate(null);
  };

  const save = async () => {
    const trimmed = title.trim();
    if (trimmed.length === 0 || isSaving) {
      return;
    }
    const session = sessionRef.current;
    setIsSaving(true);
    try {
      await submit({
        title: trimmed,
        deadline: dueDate ? toDueDateTime(dueDate).toISOString() : null,
      });
      if (session === sessionRef.current) {
        close();
      }
    } catch (error) {
      showToast(
        "fail",
        getErrorMessage(error, "세부 과제를 추가하지 못했어요.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const form = isAdding ? (
    <SubTaskAddForm
      title={title}
      onChangeTitle={setTitle}
      dueDate={dueDate}
      onChangeDueDate={setDueDate}
      maxDate={taskDeadline ? { date: taskDeadline, hasTime: true } : null}
      onCancel={close}
      onSave={save}
    />
  ) : undefined;

  return { open: () => setIsAdding(true), form };
}
