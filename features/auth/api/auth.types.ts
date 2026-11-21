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

/** POST /api/v1/auth/app/signin/kakao 응답 */
export type KakaoSignInResponse =
  | {
      accessToken: string;
      refreshToken: string;
      /** 이번 로그인으로 처음 가입했는지 */
      isNewUser: boolean;
      user: {
        id: number;
        email: string;
        nickname: string;
      };
    }
  | {
      /** 탈퇴 처리된 계정이면 토큰 대신 복구 토큰을 준다 */
      withdrawnUser: true;
      restoreToken: string;
    };

/** POST /api/v1/auth/app/signin/apple 요청. 서버는 user 의 이름으로 닉네임을 만든다 */
export type AppleSignInRequest = {
  identityToken: string;
  /** 애플은 이름·이메일을 첫 로그인 때만 준다. 그 외에는 null */
  user: {
    name: { firstName: string | null; lastName: string | null };
    email: string | null;
  } | null;
};

/** POST /api/v1/auth/app/signin/apple 응답. 카카오와 같은 형식이다 */
export type AppleSignInResponse = KakaoSignInResponse;

/** GET /api/v1/auth/check-email 응답 */
export type CheckEmailResponse = {
  isDuplicate: boolean;
};

export type VerifyEmailCodeRequest = {
  email: string;
  /** 메일로 받은 6자리 코드 */
  code: string;
};

/** POST /api/v1/auth/password/reset/verify 응답 */
export type VerifyPasswordResetCodeResponse = {
  /** 새 비밀번호 설정에 쓰는 일회용 토큰 (10분 유효) */
  resetToken: string;
};

export type ConfirmPasswordResetRequest = {
  resetToken: string;
  newPassword: string;
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
