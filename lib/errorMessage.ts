import { ApiError } from "@/lib/api/apiError";
import { SocketError } from "@/lib/socket/socketClient";

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.reason;
  }
  if (error instanceof SocketError) {
    // 서버가 실패 이유를 보내지 않으면 메시지가 비어 있다.
    return error.message || fallback;
  }
  return fallback;
}
