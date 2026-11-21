import { apiClient } from "@/lib/api/client";

import type {
  AppleSignInRequest,
  AppleSignInResponse,
  CheckEmailResponse,
  ConfirmPasswordResetRequest,
  KakaoSignInResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  VerifyEmailCodeRequest,
  VerifyPasswordResetCodeResponse,
} from "./auth.types";

export function signIn(body: SignInRequest) {
  return apiClient.post<SignInResponse>("/api/v1/auth/app/signin", body);
}

// 카카오 SDK로 받은 카카오 access token 을 보내면 서버가 로그인·가입을 처리한다
export function signInWithKakao(kakaoAccessToken: string) {
  return apiClient.post<KakaoSignInResponse>("/api/v1/auth/app/signin/kakao", {
    kakaoAccessToken,
  });
}

// 애플 로그인으로 받은 identityToken 을 보내면 서버가 로그인·가입을 처리한다
export function signInWithApple(body: AppleSignInRequest) {
  return apiClient.post<AppleSignInResponse>(
    "/api/v1/auth/app/signin/apple",
    body
  );
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

// 가입 안 된 이메일이어도 서버는 200 을 준다 (가입 여부를 숨기려고)
export function sendPasswordResetCode(email: string) {
  return apiClient.post<null>("/api/v1/auth/password/reset/send", { email });
}

export function verifyPasswordResetCode(body: VerifyEmailCodeRequest) {
  return apiClient.post<VerifyPasswordResetCodeResponse>(
    "/api/v1/auth/password/reset/verify",
    body
  );
}

export function confirmPasswordReset(body: ConfirmPasswordResetRequest) {
  return apiClient.post<null>("/api/v1/auth/password/reset/confirm", body);
}
