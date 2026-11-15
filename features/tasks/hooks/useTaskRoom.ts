import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { getSocket } from "@/lib/socket/socketClient";

import { taskKeys } from "../api/taskApi";

// 서버가 과제 방 전체(요청한 본인 포함)에 보내는 변경 알림
const TASK_CHANGED_EVENTS = [
  "task:updated",
  "subtaskStatusUpdated",
  "deadlineUpdated",
  "subtaskAssigneeUpdated",
  "subtask:created",
  "subtask:updated",
  "subtask:deleted",
  "subtask:deletedAll",
  "member:updated",
  "comment:created",
  "comment:updated",
  "comment:deleted",
  "reference:created",
  "reference:updated",
  "reference:deleted",
  "communication:created",
  "communication:updated",
  "communication:deleted",
  "log:created",
  "log:updated",
  "log:deleted",
] as const;

export function useTaskRoom(taskId: number) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    const refresh = () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.members(taskId) });
    };
    // 재연결되면 서버가 방 정보를 잃으므로 연결될 때마다 다시 들어간다.
    // 방 밖에 있던 동안의 변경 알림은 받지 못했으니 들어간 뒤 다시 불러온다.
    const join = () => {
      socket.emit("joinTaskRoom", taskId);
      refresh();
    };

    if (socket.connected) {
      join();
    }
    socket.on("connect", join);
    TASK_CHANGED_EVENTS.forEach((event) => socket.on(event, refresh));

    return () => {
      socket.off("connect", join);
      TASK_CHANGED_EVENTS.forEach((event) => socket.off(event, refresh));
    };
  }, [taskId, queryClient]);
}
