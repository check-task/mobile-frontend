import type { Dispatch, SetStateAction } from "react";

import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { SubTask } from "../components/SubTaskRow";

type UseSubTaskToggleParams = {
  subTasks: readonly SubTask[];
  setSubTasks: Dispatch<SetStateAction<SubTask[]>>;
  field: "done" | "alarm";
  submit: (subTaskId: number, value: boolean) => Promise<unknown>;
  failMessage: string;
};

// 누르면 바로 바꾸고, 저장에 실패하면 되돌린다.
export function useSubTaskToggle({
  subTasks,
  setSubTasks,
  field,
  submit,
  failMessage,
}: UseSubTaskToggleParams) {
  const { showToast } = useToast();

  return (id: string) => {
    const target = subTasks.find((subTask) => subTask.id === id);
    if (!target) {
      return;
    }
    const next = !target[field];
    const setValue = (value: boolean) =>
      setSubTasks((current) =>
        current.map((subTask) =>
          subTask.id === id ? { ...subTask, [field]: value } : subTask
        )
      );

    setValue(next);
    submit(Number(id), next).catch((error: unknown) => {
      setValue(!next);
      showToast("fail", getErrorMessage(error, failMessage));
    });
  };
}
