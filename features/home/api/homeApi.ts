import { apiClient } from "@/lib/api/client";

import type {
  JoinTeamTaskRequest,
  JoinTeamTaskResponse,
  TaskListParams,
  TaskListResponse,
} from "./home.types";

export const homeKeys = {
  // taskKeys.all(["task"]) 아래에 두어 과제 생성·수정·삭제 후 함께 다시 불러온다
  lists: () => ["task", "list"] as const,
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
