import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import { taskKeys } from "../api/taskApi";
import type { SubTask } from "../components/SubTaskRow";
import { useTaskDetailQuery } from "./useTaskDetailQuery";

type UseSubTaskToggleParams = {
  taskId: number;
  field: "done" | "alarm";
  submit: (subTaskId: number, value: boolean) => Promise<unknown>;
  failMessage: string;
};

/** savedAt: 저장이 끝났을 때 캐시에 들어 있던 상세 조회 시각. 화면이 이 조회를 그리면 덮어 쓴 값을 뺀다. */
type Pending = Readonly<
  Record<string, { value: boolean; savedAt: number | null }>
>;

// 누른 값을 기억해 조회 결과 위에 덮어 그린다.
// 같은 항목의 요청은 하나씩 보내서, 연달아 눌러도 서버에 마지막으로 누른 값이 남게 한다.
// submit 은 저장한 뒤 상세를 다시 받아 오고 끝나므로, 그때 캐시의 조회 시각(dataUpdatedAt)이 저장 이후 조회다.
// 화면이 그 조회를 그린 뒤에 뺀다. 바로 빼면 화면이 아직 예전 조회를 그리고 있어 한 프레임 예전 값이 보인다.
// 값이 같은지가 아니라 조회 시각으로 판단하므로, 그 사이 팀원이 바꾼 값도 가리지 않고 그대로 보여 준다.
export function useSubTaskToggle({
  taskId,
  field,
  submit,
  failMessage,
}: UseSubTaskToggleParams) {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { dataUpdatedAt } = useTaskDetailQuery(taskId);
  const [pending, setPending] = useState<Pending>({});
  // 항목별로 마지막으로 누른 값. 요청 중인 항목만 들어 있다.
  const desiredRef = useRef<Record<string, boolean>>({});

  // 그리는 조회나 덮어 쓴 값이 바뀐 렌더에서 바로, 저장 이후 조회가 그려진 항목을 뺀다.
  const [synced, setSynced] = useState({ dataUpdatedAt, pending });
  if (synced.dataUpdatedAt !== dataUpdatedAt || synced.pending !== pending) {
    setSynced({ dataUpdatedAt, pending });
    const reflected = Object.keys(pending).filter((id) => {
      const { savedAt } = pending[id];
      return savedAt !== null && dataUpdatedAt >= savedAt;
    });
    if (reflected.length > 0) {
      const next = { ...pending };
      reflected.forEach((id) => delete next[id]);
      setPending(next);
    }
  }

  const apply = (subTasks: readonly SubTask[]) => {
    return subTasks.map((subTask) => {
      const entry = pending[subTask.id];
      return entry ? { ...subTask, [field]: entry.value } : subTask;
    });
  };

  const run = async (id: string) => {
    let sent: boolean;
    try {
      do {
        sent = desiredRef.current[id];
        await submit(Number(id), sent);
      } while (desiredRef.current[id] !== sent);
      delete desiredRef.current[id];
      const savedAt =
        queryClient.getQueryState(taskKeys.detail(taskId))?.dataUpdatedAt ?? 0;
      setPending((current) =>
        current[id]
          ? { ...current, [id]: { ...current[id], savedAt } }
          : current
      );
    } catch (error: unknown) {
      showToast("fail", getErrorMessage(error, failMessage));
      delete desiredRef.current[id];
      setPending(({ [id]: _failed, ...rest }) => rest);
    }
  };

  const toggle = (subTasks: readonly SubTask[], id: string) => {
    const target = subTasks.find((subTask) => subTask.id === id);
    if (!target) {
      return;
    }
    const value = !target[field];
    setPending((current) => ({ ...current, [id]: { value, savedAt: null } }));
    const inFlight = id in desiredRef.current;
    desiredRef.current[id] = value;
    // 요청 중이면 값만 바꿔 두고, 진행 중인 요청이 끝난 뒤 이어서 보낸다.
    if (!inFlight) {
      void run(id);
    }
  };

  return { apply, toggle };
}
