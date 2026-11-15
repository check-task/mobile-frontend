import { useRef, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { SubTask } from "../components/SubTaskRow";

type UseSubTaskToggleParams = {
  field: "done" | "alarm";
  /** 저장하고, 상세를 다시 받아 온 뒤에 끝나야 한다. 그 전에 끝나면 잠깐 예전 값이 보인다. */
  submit: (subTaskId: number, value: boolean) => Promise<unknown>;
  failMessage: string;
};

type Pending = Readonly<Record<string, { value: boolean; seq: number }>>;

// 저장 중인 값만 기억해 조회 결과 위에 덮어 그린다. 다시 불러온 데이터가 진행 중인 변경을 지우지 않고,
// 저장이 끝나면(실패 포함) 빼서 조회 결과를 그대로 보여 준다.
export function useSubTaskToggle({
  field,
  submit,
  failMessage,
}: UseSubTaskToggleParams) {
  const { showToast } = useToast();
  const [pending, setPending] = useState<Pending>({});
  const seqRef = useRef(0);

  const apply = (subTasks: readonly SubTask[]) =>
    subTasks.map((subTask) => {
      const entry = pending[subTask.id];
      return entry ? { ...subTask, [field]: entry.value } : subTask;
    });

  const toggle = (subTasks: readonly SubTask[], id: string) => {
    const target = subTasks.find((subTask) => subTask.id === id);
    if (!target) {
      return;
    }
    const value = !target[field];
    const seq = ++seqRef.current;
    setPending((current) => ({ ...current, [id]: { value, seq } }));

    submit(Number(id), value)
      .catch((error: unknown) =>
        showToast("fail", getErrorMessage(error, failMessage))
      )
      .finally(() =>
        // 같은 항목을 또 눌러 새 요청이 나갔으면 그 값은 남긴다.
        setPending((current) => {
          if (current[id]?.seq !== seq) {
            return current;
          }
          const { [id]: _done, ...rest } = current;
          return rest;
        })
      );
  };

  return { apply, toggle };
}
