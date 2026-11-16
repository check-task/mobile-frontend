import { useRef, useState } from "react";

import { useToast } from "@/hooks/useToast";
import { getErrorMessage } from "@/lib/errorMessage";

import type { SubTask } from "../components/SubTaskRow";

type UseSubTaskToggleParams = {
  /** 조회 결과의 세부 과제 목록. 저장한 값이 여기에 반영되면 덮어 쓴 값을 뺀다. */
  serverSubTasks: readonly SubTask[];
  field: "done" | "alarm";
  submit: (subTaskId: number, value: boolean) => Promise<unknown>;
  failMessage: string;
};

/** settled: 저장은 끝났고 조회 결과에 반영되기를 기다리는 중 */
type Pending = Readonly<Record<string, { value: boolean; settled: boolean }>>;

// 누른 값을 기억해 조회 결과 위에 덮어 그린다.
// 같은 항목의 요청은 하나씩 보내서, 연달아 눌러도 서버에 마지막으로 누른 값이 남게 한다.
// 저장이 끝나도 조회 결과가 그 값으로 바뀐 뒤에 빼야 한다. 바로 빼면 한 프레임 예전 값이 보여 아이콘이 흔들린다.
export function useSubTaskToggle({
  serverSubTasks,
  field,
  submit,
  failMessage,
}: UseSubTaskToggleParams) {
  const { showToast } = useToast();
  const [pending, setPending] = useState<Pending>({});
  // 항목별로 마지막으로 누른 값. 요청 중인 항목만 들어 있다.
  const desiredRef = useRef<Record<string, boolean>>({});

  // 조회 결과나 덮어 쓴 값이 바뀐 렌더에서 바로, 저장이 끝나 조회 결과에 반영된 항목을 뺀다.
  // 조회가 저장 완료 표시보다 먼저 끝나는 경우도 있어서 둘 중 하나만 바뀌어도 다시 본다.
  const [synced, setSynced] = useState({ server: serverSubTasks, pending });
  if (synced.server !== serverSubTasks || synced.pending !== pending) {
    setSynced({ server: serverSubTasks, pending });
    const reflected = Object.keys(pending).filter((id) => {
      const entry = pending[id];
      const server = serverSubTasks.find((subTask) => subTask.id === id);
      return entry.settled && server?.[field] === entry.value;
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
      setPending((current) =>
        current[id]
          ? { ...current, [id]: { ...current[id], settled: true } }
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
    setPending((current) => ({ ...current, [id]: { value, settled: false } }));
    const inFlight = id in desiredRef.current;
    desiredRef.current[id] = value;
    // 요청 중이면 값만 바꿔 두고, 진행 중인 요청이 끝난 뒤 이어서 보낸다.
    if (!inFlight) {
      void run(id);
    }
  };

  return { apply, toggle };
}
