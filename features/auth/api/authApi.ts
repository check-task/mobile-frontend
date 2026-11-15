import { apiClient } from "@/lib/api/client";

import type {
  CheckEmailResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  VerifyEmailCodeRequest,
} from "./auth.types";

export function signIn(body: SignInRequest) {
  return apiClient.post<SignInResponse>("/api/v1/auth/app/signin", body);
}

export function checkEmail(email: string) {
  return apiClient.get<CheckEmailResponse>("/api/v1/auth/check-email", {
    params: { email },
  });
}

export function sendEmailCode(email: string) {
  return apiClient.post<null>("/api/v1/auth/email/send", { email });
}

export function resendEmailCode(email: string) {
  return apiClient.post<null>("/api/v1/auth/email/resend", { email });
}

export function verifyEmailCode(body: VerifyEmailCodeRequest) {
  return apiClient.post<null>("/api/v1/auth/email/verify", body);
}

export function signUp({ profileImage, ...fields }: SignUpRequest) {
  const form = new FormData();
  form.append("email", fields.email);
  form.append("password", fields.password);
  form.append("nickname", fields.nickname);
  if (fields.phoneNum) form.append("phoneNum", fields.phoneNum);
  if (profileImage) {
    // TS 가 유니온으로는 오버로드를 못 골라서 나눠서 넘긴다
    if (profileImage instanceof Blob) form.append("profileImage", profileImage);
    else form.append("profileImage", profileImage);
  }
  return apiClient.post<null>("/api/v1/auth/signup", form);
}
