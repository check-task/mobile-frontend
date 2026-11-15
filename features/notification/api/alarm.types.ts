export type AlarmType =
  "TASK" | "SUBTASK" | "MEMBER" | "NOTIFICATION" | "OTHER";

export type AlarmDto = {
  alarmId: number;
  alarmType: AlarmType;
  title: string;
  alarmContent: string;
  isRead: boolean;
  alarmDate: string;
  taskType: "PERSONAL" | "TEAM";
  taskId: number;
  subTaskId: number | null;
};

/** GET /api/v1/alarm. 커서는 다음 페이지를 읽을 때 넘기는 마지막 알림 id */
export type AlarmListResponse = {
  alarmList: AlarmDto[];
  meta: { hasNextPage: boolean; cursor: number | null };
};
