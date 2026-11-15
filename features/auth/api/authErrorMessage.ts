import { ApiError } from "@/lib/api/apiError";

/**
 * 4xx 는 서버 문구가 사용자용 한국어라 그대로 쓰고,
 * 5xx·네트워크 오류는 서버 문구가 개발용일 수 있어서 fallback 을 쓴다
 */
export function getAuthErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
    return error.reason;
  }
  return fallback;
}
