import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  homeKeys,
  updateSubTaskDeadline,
  updateTaskDeadline,
} from "../api/homeApi";
import type { HomeTasks } from "../api/home.types";

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

// 드롭하자마자 캘린더에 반영하고, 실패하면 원래 자리로 되돌린다
export function useMoveDeadlineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: MoveDeadlineInput) =>
      input.kind === "main"
        ? updateTaskDeadline(input.id, input.dateKey)
        : updateSubTaskDeadline(input.id, input.dateKey),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: homeKeys.lists() });
      const previous = queryClient.getQueriesData<HomeTasks>({
        queryKey: homeKeys.lists(),
      });
      queryClient.setQueriesData<HomeTasks>(
        { queryKey: homeKeys.lists() },
        (data) => data && applyMove(data, input)
      );
      return { previous };
    },
    onError: (_error, _input, context) => {
      context?.previous.forEach(([key, data]) =>
        queryClient.setQueryData(key, data)
      );
    },
    // 과제 상세의 마감일·D-day 도 바뀌므로 과제 전체를 다시 불러온다
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["task"] }),
  });
}
