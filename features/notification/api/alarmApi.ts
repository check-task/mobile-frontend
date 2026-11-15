import { apiClient } from "@/lib/api/client";

import type { AlarmListResponse } from "./alarm.types";

const PAGE_SIZE = 20;

export const alarmKeys = {
  list: () => ["alarm", "list"] as const,
};

export function getAlarms(cursor: number | null) {
  return apiClient.get<AlarmListResponse>("/api/v1/alarm", {
    params: { limit: PAGE_SIZE, ...(cursor ? { cursor } : {}) },
  });
}

export function readAllAlarms() {
  return apiClient.patch<unknown>("/api/v1/alarm");
}

export function deleteAlarm(alarmId: number) {
  return apiClient.delete<unknown>(`/api/v1/alarm/${alarmId}`);
}

export function deleteAllAlarms() {
  return apiClient.delete<unknown>("/api/v1/alarm");
}
