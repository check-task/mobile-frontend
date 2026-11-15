import { useState } from "react";

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

  const close = () => {
    setIsAdding(false);
    setTitle("");
    setDueDate(null);
  };

  const save = async () => {
    const trimmed = title.trim();
    if (trimmed.length === 0 || isSaving) {
      return;
    }
    setIsSaving(true);
    try {
      await submit({
        title: trimmed,
        deadline: dueDate ? toDueDateTime(dueDate).toISOString() : null,
      });
      close();
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
