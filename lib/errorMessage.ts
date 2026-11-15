import { ApiError } from "@/lib/api/apiError";
import { SocketError } from "@/lib/socket/socketClient";

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError) {
    return error.reason;
  }
  if (error instanceof SocketError) {
    return error.message;
  }
  return fallback;
}
