import type { AlarmItemStatus } from "@/components/common/AlarmItem/AlarmItem";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  status: AlarmItemStatus;
};

const TITLE = "‘과제명’의 마감까지 NN시간 남았어요!";
const DESCRIPTION = "현재 NN% 완성 중이에요. 빨리 끝내고 쉬어요!";

export const NOTIFICATIONS: readonly NotificationData[] = [
  { id: "1", title: TITLE, description: DESCRIPTION, status: "new" },
  { id: "2", title: TITLE, description: DESCRIPTION, status: "new" },
  { id: "3", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "4", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "5", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "6", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "7", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "8", title: TITLE, description: DESCRIPTION, status: "read" },
  { id: "9", title: TITLE, description: DESCRIPTION, status: "read" },
];
