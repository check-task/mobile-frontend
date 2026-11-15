import { apiClient } from "@/lib/api/client";

import type {
  CreateReferenceParams,
  CreateTaskRequest,
  CreateTaskResponse,
  MyInfoResponse,
  ReferenceDto,
  TaskDetailResponse,
  AddSubTaskRequest,
  AddSubTaskResponse,
} from "./task.types";

export const taskKeys = {
  all: ["task"] as const,
  myInfo: () => ["user", "me"] as const,
  detail: (taskId: number) => ["task", "detail", taskId] as const,
};

export function getTaskDetail(taskId: number) {
  return apiClient.get<TaskDetailResponse>(`/api/v1/task/${taskId}`);
}

export function addSubTask(taskId: number, body: AddSubTaskRequest) {
  return apiClient.post<AddSubTaskResponse>(
    `/api/v1/task/${taskId}/subtask`,
    body
  );
}

export function createTask(body: CreateTaskRequest) {
  return apiClient.post<CreateTaskResponse>("/api/v1/task", body);
}

export function getMyInfo() {
  return apiClient.get<MyInfoResponse>("/api/v1/user/me");
}

export function createReference(taskId: number, params: CreateReferenceParams) {
  const form = new FormData();
  if (params.name) form.append("name", params.name);
  if (params.type === "url") {
    form.append("url", params.url);
  } else {
    // TS 가 유니온으로는 오버로드를 못 고르므로 타입별로 나눠 넘긴다.
    if (params.file instanceof Blob) form.append("file_url", params.file);
    else form.append("file_url", params.file);
  }
  return apiClient.post<ReferenceDto[]>(
    `/api/v1/reference/data/${taskId}`,
    form,
    { params: { type: params.type } }
  );
}
