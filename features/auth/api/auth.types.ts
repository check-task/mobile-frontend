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
