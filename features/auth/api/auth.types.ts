import type { NativeFilePart } from "@/types/formData.types";

export type SignInRequest = {
  email: string;
  password: string;
};

/** POST /api/v1/auth/app/signin 응답. 앱은 쿠키 대신 body 로 토큰을 받는다 */
export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
  /** access token 유효시간(초) */
  accessTokenExpireIn: number;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
};

/** GET /api/v1/auth/check-email 응답 */
export type CheckEmailResponse = {
  isDuplicate: boolean;
};

export type VerifyEmailCodeRequest = {
  email: string;
  /** 메일로 받은 6자리 코드 */
  code: string;
};

/** POST /api/v1/auth/signup (multipart) */
export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  /** 숫자만 (예: 01012345678) */
  phoneNum?: string;
  /** native 는 { uri, name, type } 파트, web 은 File */
  profileImage?: Blob | NativeFilePart;
};
