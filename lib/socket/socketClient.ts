import { io, type Socket } from "socket.io-client";

import { getAccessToken } from "@/lib/api/client";

const ACK_TIMEOUT_MS = 15_000;

// 실패 이유는 이벤트에 따라 reason 또는 message 로 온다 (댓글 수정·삭제는 message).
type SocketAck<T> =
  | { success: true; data: T }
  | { success: false; reason?: string; message?: string };

export class SocketError extends Error {}

let socket: Socket | null = null;

/** 앱 전체가 함께 쓰는 연결. 처음 부를 때 연결하고, 토큰은 연결할 때마다 다시 읽는다. */
export function getSocket() {
  if (!socket) {
    socket = io(process.env.EXPO_PUBLIC_API_URL, {
      path: "/socket.io/",
      transports: ["websocket"],
      autoConnect: false,
      auth: (callback) => {
        // 토큰을 못 읽어도 callback 을 불러야 연결이 멈추지 않는다. 토큰이 없으면 서버가 거부해 connect_error 로 간다.
        Promise.resolve()
          .then(getAccessToken)
          .catch(() => null)
          .then((token) => callback({ token: token ?? null }));
      },
    });
  }
  if (!socket.connected) {
    socket.connect();
  }
  return socket;
}

/** 로그아웃할 때 이전 계정 토큰으로 붙은 연결을 끊는다. 다음 getSocket 은 새 토큰으로 다시 연결한다 */
export function disconnectSocket() {
  socket?.disconnect();
}

export async function emitWithAck<T>(event: string, payload: unknown) {
  const ack: SocketAck<T> = await getSocket()
    .timeout(ACK_TIMEOUT_MS)
    .emitWithAck(event, payload);
  if (ack.success) {
    return ack.data;
  }
  throw new SocketError(ack.reason ?? ack.message ?? "");
}
