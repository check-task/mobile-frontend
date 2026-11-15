import type { FolderColor } from "@/types/folder.types";

import type { Resource } from "../components/ResourceSection";
import type { SubTask } from "../components/SubTaskRow";
import type {
  TaskAssignee,
  TaskComment,
} from "../components/TeamSubTaskDetail";
import type { MyFolder, TaskDetailResponse } from "./task.types";

// 디자인 토큰(constants/theme-vars.ts 라이트 값)과 hex 가 같을 때만 매핑한다.
const FOLDER_COLOR_BY_HEX: Record<string, FolderColor> = {
  "#F55757": "sub-01",
  "#FFC93F": "sub-02",
  "#6EC77B": "sub-03",
  "#A177E2": "sub-04",
  "#081221": "sub-05",
};

export function toFolderColor(hex: string): FolderColor {
  return FOLDER_COLOR_BY_HEX[hex.toUpperCase()] ?? "sub-null";
}

export type TaskDetail = {
  title: string;
  folderColor: FolderColor;
  dday: string;
  deadline: Date | null;
  subTasks: SubTask[];
  /** 팀 과제 세부 TASK 펼침 영역. 키는 세부 TASK id */
  subTaskExtras: Record<
    string,
    { assignees: TaskAssignee[]; comments: TaskComment[] }
  >;
  communications: Resource[];
  meetingLogs: Resource[];
  references: Resource[];
};

const pad = (value: number) => String(value).padStart(2, "0");

// 타임존 표기가 없으면 서버 기준인 UTC 로 읽는다.
function parseServerDate(value: string) {
  return new Date(/(Z|[+-]\d\d:\d\d)$/i.test(value) ? value : `${value}Z`);
}

/** `25.10.22` */
function formatDate(date: Date) {
  return `${pad(date.getFullYear() % 100)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

function formatTime(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toTaskDetail(data: TaskDetailResponse): TaskDetail {
  return {
    title: data.title,
    folderColor: toFolderColor(data.foldercolor),
    dday: data.dDay ?? "",
    deadline: data.deadline ? parseServerDate(data.deadline) : null,
    subTasks: data.subTasks.map((subTask) => ({
      id: String(subTask.subTaskId),
      title: subTask.title,
      dueDate: subTask.deadline
        ? formatDate(parseServerDate(subTask.deadline))
        : "미지정",
      done: subTask.status === "COMPLETED",
      alarm: subTask.isAlarm,
    })),
    subTaskExtras: Object.fromEntries(
      data.subTasks.map((subTask) => [
        String(subTask.subTaskId),
        {
          assignees: subTask.assignees.map((assignee) => ({
            id: String(assignee.memberId),
            name: assignee.nickname,
          })),
          comments: subTask.comments.map((comment) => {
            const createdAt = parseServerDate(comment.createdAt);
            return {
              id: String(comment.commentId),
              author: comment.writer,
              date: formatDate(createdAt),
              time: formatTime(createdAt),
              body: comment.content,
            };
          }),
        },
      ])
    ),
    communications: data.communications.map((item) => ({
      id: String(item.id),
      title: item.name,
      link: item.url,
    })),
    meetingLogs: data.meetingLogs.map((log) => ({
      id: String(log.id),
      title: formatDate(parseServerDate(log.date)),
      link: log.agenda ?? "",
    })),
    references: data.references.map((reference) => ({
      id: String(reference.id),
      title: reference.name,
      link: reference.url ?? reference.fileName ?? reference.fileUrl ?? "",
    })),
  };
}

export function toFolderOptions(folders: MyFolder[]) {
  return folders.map((folder) => ({
    folderId: folder.folderId,
    folderTitle: folder.folderTitle,
    color: toFolderColor(folder.color),
  }));
}
