import type { MyInfoResponse } from "@/types/user.types";

import { apiClient } from "./client";

export const userKeys = {
  me: () => ["user", "me"] as const,
};

export function getMyInfo() {
  return apiClient.get<MyInfoResponse>("/api/v1/user/me");
}
