import { apiClient } from "@/lib/api/client";

import type {
  JoinTeamTaskRequest,
  JoinTeamTaskResponse,
  TaskListParams,
  TaskListResponse,
} from "./home.types";

export const homeKeys = {
  // tasks 의 taskKeys.all 과 같은 값이어야 과제 생성·수정·삭제 후 홈 목록도 다시 불러온다
  all: ["task"] as const,
  lists: () => [...homeKeys.all, "list"] as const,
  list: (params: TaskListParams) => [...homeKeys.lists(), params] as const,
};

export function getTasks(params: TaskListParams) {
  return apiClient.get<TaskListResponse>("/api/v1/task", { params });
}

/** `deadline`: YYYY-MM-DD (시간 없음) */
export function updateTaskDeadline(taskId: number, deadline: string) {
  return apiClient.patch<unknown>(`/api/v1/task/${taskId}/deadline`, {
    deadline,
  });
}

/** `endDate`: YYYY-MM-DD, `null` 이면 날짜 미지정으로 되돌린다 */
export function updateSubTaskDeadline(
  subTaskId: number,
  endDate: string | null
) {
  return apiClient.patch<unknown>(
    `/api/v1/task/subtask/${subTaskId}/deadline`,
    {
      endDate,
    }
  );
}

export function joinTeamTask(body: JoinTeamTaskRequest) {
  return apiClient.post<JoinTeamTaskResponse>("/api/v1/task/join", body);
}
