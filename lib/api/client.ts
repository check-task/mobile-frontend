import axios, { type AxiosRequestConfig } from "axios";

import type { ApiEnvelope } from "./api.types";
import { ApiError } from "./apiError";
import { clearTokens, getTokens, saveTokens } from "./tokenStorage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT_MS = 15_000;

// 로그인 토큰이 없으면 .env 개발용 토큰을 쓴다 (로그인 없이 API 확인할 때)
export async function getAccessToken() {
  const tokens = await getTokens();
  return tokens?.accessToken ?? process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN;
}

// Content-Type 을 고정하지 않는다: 객체는 axios 가 JSON 으로, FormData 는 boundary 와 함께 정한다.
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_MS,
});

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrap<T>(body: ApiEnvelope<T>, httpStatus = 0): T {
  if ("resultType" in body) {
    if (body.resultType === "SUCCESS") return body.data;
    const detail = body.error ?? body;
    throw new ApiError(
      body.code ?? httpStatus,
      detail.errorCode ?? null,
      detail.reason ?? "요청을 처리하지 못했습니다."
    );
  }
  if (body.isSuccess) return body.data;
  throw new ApiError(body.status, body.code, body.message);
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    if (body && typeof body === "object") {
      try {
        unwrap(body, status);
      } catch (apiError) {
        if (apiError instanceof ApiError) return apiError;
      }
    }
    return new ApiError(status, null, error.message);
  }
  return new ApiError(0, null, String(error));
}

type RefreshResponse = {
  accessToken: string;
  accessTokenExpireIn: number;
};

// 동시에 여러 요청이 401을 받아도 재발급은 한 번만 보낸다
let refreshing: Promise<boolean> | null = null;

// 재발급 중에 다른 계정으로 로그인했으면 그 토큰을 건드리지 않는다
async function isSameSession(refreshToken: string) {
  const current = await getTokens();
  return current?.refreshToken === refreshToken;
}

/** access token 재발급. 성공하면 true */
function refreshAccessToken() {
  refreshing ??= (async () => {
    const tokens = await getTokens();
    if (!tokens) return false;
    try {
      // instance 를 쓰면 인터셉터가 access token 을 덮어써서 axios 로 직접 보낸다
      const response = await axios.post<ApiEnvelope<RefreshResponse>>(
        "/api/v1/auth/refresh",
        undefined,
        {
          baseURL: BASE_URL,
          timeout: TIMEOUT_MS,
          headers: { Authorization: `Bearer ${tokens.refreshToken}` },
        }
      );
      const { accessToken } = unwrap(response.data);
      // 세션이 바뀌었으면 이전 계정 요청이 새 계정 토큰으로 나가지 않게 재시도하지 않는다
      if (!(await isSameSession(tokens.refreshToken))) return false;
      await saveTokens({ ...tokens, accessToken });
      return true;
    } catch (error) {
      // refresh token 이 만료됐거나 없으면 다시 로그인해야 해서 지운다. 네트워크 오류면 남겨 둔다
      // HTTP 2xx 에 FAIL envelope 가 와도 envelope 의 code 로 판단한다
      const { status } = toApiError(error);
      if (
        (status === 400 || status === 401) &&
        (await isSameSession(tokens.refreshToken))
      ) {
        await clearTokens();
      }
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

/**
 * 로그아웃. 서버에 refresh token 폐기를 요청하고 이 기기 토큰을 지운다.
 * 서버 요청이 실패해도(네트워크 등) 이 기기에서는 로그아웃한다
 */
export async function signOut() {
  const tokens = await getTokens();
  try {
    if (tokens) {
      // 재발급과 같이 refresh token 을 헤더로 보낸다. instance 인터셉터가 덮어쓰지 않게 axios 로 직접 보낸다
      await axios.post("/api/v1/auth/logout", undefined, {
        baseURL: BASE_URL,
        timeout: TIMEOUT_MS,
        headers: { Authorization: `Bearer ${tokens.refreshToken}` },
      });
    }
  } catch {
    // 서버에서 못 지운 refresh token 은 만료되면 끝난다
  } finally {
    await clearTokens();
  }
}

// 로그인·재발급 같은 인증 API의 401은 토큰 만료가 아니라서 재발급하지 않는다
function shouldRefresh(error: unknown, config: AxiosRequestConfig) {
  return (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    !config.url?.startsWith("/api/v1/auth/")
  );
}

async function send<T>(config: AxiosRequestConfig) {
  const response = await instance.request<ApiEnvelope<T>>(config);
  return unwrap(response.data, response.status);
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    return await send<T>(config);
  } catch (error) {
    if (shouldRefresh(error, config) && (await refreshAccessToken())) {
      try {
        return await send<T>(config);
      } catch (retryError) {
        throw toApiError(retryError);
      }
    }
    throw toApiError(error);
  }
}

/** envelope 를 벗긴 data 를 돌려준다. 실패는 모두 ApiError 로 throw 한다. */
export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "GET", url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "POST", url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "PATCH", url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: "DELETE", url }),
};
