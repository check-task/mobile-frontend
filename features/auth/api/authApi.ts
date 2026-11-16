import { apiClient } from "@/lib/api/client";

import type { SignInRequest, SignInResponse } from "./auth.types";

export function signIn(body: SignInRequest) {
  return apiClient.post<SignInResponse>("/api/v1/auth/app/signin", body);
}
