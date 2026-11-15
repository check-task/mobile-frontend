import axios, { type AxiosRequestConfig } from "axios";

import type { ApiEnvelope } from "./api.types";
import { ApiError } from "./apiError";

type AccessTokenGetter = () =>
  string | null | undefined | Promise<string | null | undefined>;

// TODO(auth): 인증 담당자가 setAccessTokenGetter 로 토큰 저장소를 연결하면 개발용 토큰은 쓰지 않는다.
let accessTokenGetter: AccessTokenGetter = () =>
  process.env.EXPO_PUBLIC_DEV_ACCESS_TOKEN;

export function setAccessTokenGetter(getter: AccessTokenGetter) {
  accessTokenGetter = getter;
}

export function getAccessToken() {
  return accessTokenGetter();
}

// Content-Type 을 고정하지 않는다: 객체는 axios 가 JSON 으로, FormData 는 boundary 와 함께 정한다.
const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
});

instance.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function unwrap<T>(body: ApiEnvelope<T>): T {
  if ("resultType" in body) {
    if (body.resultType === "SUCCESS") return body.data;
    throw new ApiError(body.code, body.errorCode, body.reason);
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
        unwrap(body);
      } catch (apiError) {
        if (apiError instanceof ApiError) return apiError;
      }
    }
    return new ApiError(status, null, error.message);
  }
  return new ApiError(0, null, String(error));
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await instance.request<ApiEnvelope<T>>(config);
    return unwrap(response.data);
  } catch (error) {
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
