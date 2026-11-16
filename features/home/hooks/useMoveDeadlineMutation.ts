import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/hooks/useToast";
import { ApiError } from "@/lib/api/apiError";
import { getErrorMessage } from "@/lib/errorMessage";

import {
  homeKeys,
  updateSubTaskDeadline,
  updateTaskDeadline,
} from "../api/homeApi";
import type { HomeTasks } from "../api/home.types";

export const SUB_TASK_AFTER_TASK_MESSAGE =
  "마감일 이전 날짜로 설정할 수 없습니다.";
// 서버 400 reason 과 같은 문구
export const TASK_BEFORE_SUB_TASK_MESSAGE =
  "세부 과제의 마감일보다 이른 날짜로 변경할 수 없습니다.";

const MOVE_DEADLINE_KEY = ["home", "moveDeadline"] as const;

/** 과제는 마감일이 필수, 세부 task 는 `null`(날짜 미지정) 가능 */
export type MoveDeadlineInput =
  | { kind: "main"; id: number; dateKey: string }
  | { kind: "sub"; id: number; dateKey: string | null };

function applyMove(data: HomeTasks, { kind, id, dateKey }: MoveDeadlineInput) {
  return kind === "main"
    ? {
        ...data,
        tasks: data.tasks.map((task) =>
          task.id === id ? { ...task, deadline: dateKey } : task
        ),
      }
    : {
        ...data,
        subTasks: data.subTasks.map((sub) =>
          sub.id === id ? { ...sub, deadline: dateKey } : sub
        ),
      };
}

/** 옮기기 전 날짜로 되돌리는 입력. 캐시에 그 항목이 없으면 `undefined` */
function toRevert(
  data: HomeTasks,
  input: MoveDeadlineInput
): MoveDeadlineInput | undefined {
  if (input.kind === "main") {
    const task = data.tasks.find(({ id }) => id === input.id);
    return task && { kind: "main", id: input.id, dateKey: task.deadline };
  }
  const subTask = data.subTasks.find(({ id }) => id === input.id);
  return subTask && { kind: "sub", id: input.id, dateKey: subTask.deadline };
}

// 드롭하자마자 캘린더에 반영하고, 실패하면 그 항목만 원래 날짜로 되돌린다.
// 목록 전체 snapshot 으로 되돌리면 연달아 옮긴 다른 항목의 변경까지 덮어쓰게 된다.
export function useMoveDeadlineMutation() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationKey: MOVE_DEADLINE_KEY,
    mutationFn: (input: MoveDeadlineInput) =>
      input.kind === "main"
        ? updateTaskDeadline(input.id, input.dateKey)
        : updateSubTaskDeadline(input.id, input.dateKey),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: homeKeys.lists() });
      const revert = queryClient
        .getQueriesData<HomeTasks>({ queryKey: homeKeys.lists() })
        .map(([, data]) => data && toRevert(data, input))
        .find((value) => value !== undefined);
      queryClient.setQueriesData<HomeTasks>(
        { queryKey: homeKeys.lists() },
        (data) => data && applyMove(data, input)
      );
      return { revert };
    },
    // mutate 호출별 콜백은 마지막 호출 것만 실행되므로, 연달아 옮겨도 실패마다 토스트가 뜨도록 여기서 처리한다.
    // 완료된 세부 task 는 목록에 없어 서버만 막을 수 있다. 과제 충돌은 서버 reason 이 TASK_BEFORE_SUB_TASK_MESSAGE 와 같다
    onError: (error, _input, context) => {
      const revert = context?.revert;
      if (revert) {
        queryClient.setQueriesData<HomeTasks>(
          { queryKey: homeKeys.lists() },
          (data) => data && applyMove(data, revert)
        );
      }
      const isSubTaskAfterTask =
        error instanceof ApiError && error.errorCode === "INVALID_DEADLINE";
      showToast(
        "fail",
        isSubTaskAfterTask
          ? SUB_TASK_AFTER_TASK_MESSAGE
          : getErrorMessage(error, "마감일을 바꾸지 못했습니다.")
      );
    },
    // 과제 상세의 마감일·D-day 도 바뀌므로 과제 전체를 다시 불러온다.
    // 아직 저장 중인 이동이 있으면 그 결과가 반영되기 전 목록을 받아 깜빡이므로, 마지막 이동이 끝날 때만 불러온다
    onSettled: () =>
      queryClient.isMutating({ mutationKey: MOVE_DEADLINE_KEY }) === 1
        ? queryClient.invalidateQueries({ queryKey: homeKeys.all })
        : undefined,
  });
}
