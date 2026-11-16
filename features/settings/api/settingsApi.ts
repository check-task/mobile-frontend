import { apiClient } from "@/lib/api/client";

import type {
  FolderRequest,
  FolderResponse,
  UpdateFolderPriorityRequest,
  UpdateProfileRequest,
} from "./settings.types";

export function createFolder(body: FolderRequest) {
  return apiClient.post<FolderResponse>("/api/v1/user/folder", body);
}

export function updateFolder(folderId: number, body: FolderRequest) {
  return apiClient.patch<FolderResponse>(
    `/api/v1/user/folder/${folderId}`,
    body
  );
}

// moveTasks 가 없으면 과제가 든 폴더는 FOLDER_NOT_EMPTY 로 실패한다. 화면 안내대로 `지정안함`으로 옮긴다
export function deleteFolder(folderId: number) {
  return apiClient.delete<null>(`/api/v1/user/folder/${folderId}`, {
    params: { moveTasks: true },
  });
}

export function updateFolderPriority(body: UpdateFolderPriorityRequest) {
  return apiClient.patch<unknown>("/api/v1/user/folder/priority", body);
}

export function updateProfile({ image, ...fields }: UpdateProfileRequest) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) form.append(key, value);
  }
  if (image) {
    // TS 가 유니온으로는 오버로드를 못 골라서 나눠서 넘긴다
    if (image instanceof Blob) form.append("image", image);
    else form.append("image", image);
  }
  return apiClient.patch<unknown>("/api/v1/user/profile", form);
}

export function updateDeadlineAlarm(deadlineAlarm: number) {
  return apiClient.patch<unknown>("/api/v1/alarm/settings/deadline", {
    deadlineAlarm,
  });
}

export function updateTaskAlarm(taskAlarm: number) {
  return apiClient.patch<unknown>("/api/v1/alarm/settings/task", {
    taskAlarm,
  });
}
