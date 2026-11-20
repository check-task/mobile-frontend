import { apiClient } from "@/lib/api/client";
import type { NativeFilePart } from "@/types/formData.types";

import type {
  CompletedTasksResponse,
  CreateReferenceParams,
  CreateTaskRequest,
  CreateTaskResponse,
  ReferenceDto,
  TaskDetailResponse,
  AddSubTaskRequest,
  AddSubTaskResponse,
  SubTaskStatus,
  TaskListResponse,
  TaskMembersResponse,
  TaskType,
  InviteCodeResponse,
  UpdateReferenceParams,
  UpdateTaskRequest,
} from "./task.types";

export const taskKeys = {
  all: ["task"] as const,
  // 과제를 만들거나 고치면 taskKeys.all 을 invalidate 해서 목록도 같이 갱신된다.
  // 홈 목록 key(["task", "list", ...])와 캐시 모양이 달라서 겹치지 않게 "myList" 로 둔다
  myList: (type: TaskType) => ["task", "myList", type] as const,
  completed: () => ["task", "completed"] as const,
  detail: (taskId: number) => ["task", "detail", taskId] as const,
  members: (taskId: number) => ["task", "members", taskId] as const,
};

export function getTasks(type: TaskType) {
  return apiClient.get<TaskListResponse>("/api/v1/task", {
    // 마감이 지난 과제는 완료 과제로 가므로 진행 중인 과제만 받는다
    params: { type, status: "PROGRESS" },
  });
}

export function getCompletedTasks() {
  return apiClient.get<CompletedTasksResponse>("/api/v1/task/completed");
}

export function getTaskDetail(taskId: number) {
  return apiClient.get<TaskDetailResponse>(`/api/v1/task/${taskId}`);
}

export function getTaskMembers(taskId: number) {
  return apiClient.get<TaskMembersResponse>(`/api/v1/task/${taskId}/members`);
}

export function createInviteCode(taskId: number) {
  return apiClient.post<InviteCodeResponse>(
    `/api/v1/task/${taskId}/invitation`
  );
}

export function removeTaskMember(taskId: number, userId: number) {
  return apiClient.delete<unknown>(`/api/v1/task/${taskId}/member/${userId}`);
}

export function updateSubTaskStatus(subTaskId: number, status: SubTaskStatus) {
  return apiClient.patch<unknown>(`/api/v1/task/subtask/${subTaskId}/status`, {
    status,
  });
}

/** `endDate`: ISO 시각, `null` 이면 날짜 미지정으로 되돌린다 */
export function updateSubTaskDeadline(
  subTaskId: number,
  endDate: string | null
) {
  return apiClient.patch<unknown>(
    `/api/v1/task/subtask/${subTaskId}/deadline`,
    { endDate }
  );
}

export function updateSubTaskAlarm(
  taskId: number,
  subTaskId: number,
  isAlarm: boolean
) {
  return apiClient.patch<unknown>(`/api/v1/task/${taskId}/subtask`, {
    subTasks: [{ subTaskId, isAlarm }],
  });
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

function toReferenceForm({
  name,
  url,
  file,
}: {
  name?: string;
  url?: string;
  file?: Blob | NativeFilePart;
}) {
  const form = new FormData();
  if (name) form.append("name", name);
  if (url) form.append("url", url);
  // TS 가 유니온으로는 오버로드를 못 고르므로 타입별로 나눠 넘긴다.
  if (file instanceof Blob) form.append("file_url", file);
  else if (file) form.append("file_url", file);
  return form;
}

export function createReference(taskId: number, params: CreateReferenceParams) {
  return apiClient.post<ReferenceDto[]>(
    `/api/v1/reference/data/${taskId}`,
    toReferenceForm(params),
    { params: { type: params.type } }
  );
}

export function updateReference(
  taskId: number,
  referenceId: number,
  params: UpdateReferenceParams
) {
  return apiClient.patch<unknown>(
    `/api/v1/reference/data/${taskId}/${referenceId}`,
    toReferenceForm(params)
  );
}

export function deleteReference(taskId: number, referenceId: number) {
  return apiClient.delete<unknown>(
    `/api/v1/reference/data/${taskId}/${referenceId}`
  );
}

export function updateTask(taskId: number, body: UpdateTaskRequest) {
  return apiClient.patch<{ taskId: number }>(`/api/v1/task/${taskId}`, body);
}

/** 팀장이면 과제 삭제, 팀원이면 본인만 탈퇴한다 (서버가 역할로 판단) */
/** 개인 과제를 팀 과제로 바꾼다. 개인 과제 소유자만 할 수 있고, 팀 → 개인은 서버가 지원하지 않는다 */
export function convertTaskToTeam(taskId: number) {
  return apiClient.patch<unknown>(`/api/v1/task/${taskId}/convert-to-team`);
}

export function deleteTask(taskId: number) {
  return apiClient.delete<unknown>(`/api/v1/task/${taskId}`);
}

export function deleteSubTasks(taskId: number, subTaskIds: number[]) {
  return apiClient.delete<unknown>(`/api/v1/task/${taskId}/subtask`, {
    data: { subTaskIds },
  });
}
