import { Platform } from "react-native";

import { type DueDate, formatShortDate } from "@/lib/dueDate";
import type { FolderColor } from "@/types/folder.types";
import type { NativeFilePart } from "@/types/formData.types";

import type { Resource } from "../components/ResourceSection";
import type { SubTask } from "../components/SubTaskRow";
import type {
  TaskAssignee,
  TaskComment,
} from "../components/TeamSubTaskDetail";
import type {
  CompletedTaskDto,
  CreateReferenceParams,
  MyFolder,
  TaskDetailResponse,
  TaskListItemDto,
} from "./task.types";
import type { ResourceDraft, TaskFormValue } from "./taskForm.types";
import type { TaskFolder, TaskListItem } from "./taskList.types";

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
        ? formatShortDate(parseServerDate(subTask.deadline))
        : "미지정",
      done: subTask.status === "COMPLETED",
      alarm: subTask.isAlarm,
    })),
    subTaskExtras: Object.fromEntries(
      data.subTasks.map((subTask) => [
        String(subTask.subTaskId),
        {
          assignees: subTask.assignees.map((assignee) => ({
            id: String(assignee.userId),
            name: assignee.nickname,
          })),
          comments: subTask.comments.map((comment) => {
            const createdAt = parseServerDate(comment.createdAt);
            return {
              id: String(comment.commentId),
              author: comment.writer,
              date: formatShortDate(createdAt),
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
      title: formatShortDate(parseServerDate(log.date)),
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

/** 목록 화면 폴더 필터용 */
export function toTaskFolders(folders: MyFolder[]): TaskFolder[] {
  return folders.map((folder) => ({
    id: String(folder.folderId),
    name: folder.folderTitle,
    color: toFolderColor(folder.color),
  }));
}

export function toTaskListItem(dto: TaskListItemDto): TaskListItem {
  return {
    id: String(dto.taskId),
    folderId: dto.folderId === null ? null : String(dto.folderId),
    folderName: dto.folderTitle,
    folderColor: toFolderColor(dto.foldercolor),
    title: dto.title,
    scope: dto.type === "TEAM" ? "team" : "personal",
    dday: dto.dDay,
    completedDate: "",
  };
}

// 완료 과제 API 는 type 을 한글("개인"/"팀")로 준다
function toScope(type: string) {
  return type === "TEAM" || type === "팀" ? "team" : "personal";
}

/** 완료 과제 = 마감일이 지난 과제라서 마감일을 `2026.10.31` 로 보여준다 */
export function toCompletedTaskListItem(dto: CompletedTaskDto): TaskListItem {
  // 날짜만 있는 마감(T23:59:59)이 UTC 로 읽혀 하루 밀리지 않게 상세 화면과 같은 방식으로 읽는다
  const deadline = toDueDate(dto.deadline).date;
  return {
    id: String(dto.taskId),
    folderId: dto.folderId === null ? null : String(dto.folderId),
    folderName: dto.folderTitle ?? "",
    folderColor: toFolderColor(dto.color ?? ""),
    title: dto.title,
    scope: toScope(dto.type),
    dday: "",
    completedDate: `${deadline.getFullYear()}.${pad(deadline.getMonth() + 1)}.${pad(deadline.getDate())}`,
  };
}

/**
 * 날짜만 고른 마감으로 되돌리는 경우: 앱이 저장한 23:59(toDueDateTime, 로컬), 또는 서버 원문이 `T23:59:59`(날짜만 있는 데이터).
 * shortcut: 서버가 시간 지정 여부를 안 주므로 시각으로 추정한다, 백엔드가 필드를 주면 교체
 */
function toDueDate(value: string): DueDate {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})T23:59:59/.exec(value);
  if (dateOnly) {
    const [, year, month, day] = dateOnly.map(Number);
    return { date: new Date(year, month - 1, day), hasTime: false };
  }
  const date = parseServerDate(value);
  if (date.getHours() === 23 && date.getMinutes() === 59) {
    return {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      hasTime: false,
    };
  }
  return { date, hasTime: true };
}

/** 수정 화면 초기값. 서버 항목 id 는 숫자 문자열, 새로 추가한 항목은 `new-` 로 시작한다 */
export function toTaskFormValue(data: TaskDetailResponse): TaskFormValue {
  return {
    isTeam: data.type === "TEAM",
    title: data.title,
    folderId: data.folderId,
    deadline: data.deadline ? toDueDate(data.deadline) : null,
    subTasks: data.subTasks.map((subTask) => ({
      id: String(subTask.subTaskId),
      title: subTask.title,
      dueDate: subTask.deadline ? toDueDate(subTask.deadline) : null,
    })),
    resources: data.references.map((reference) =>
      reference.url
        ? {
            id: String(reference.id),
            type: "url" as const,
            name: reference.name,
            path: reference.url,
          }
        : {
            id: String(reference.id),
            type: "file" as const,
            name: reference.name,
            path: reference.fileName ?? reference.fileUrl ?? "",
          }
    ),
  };
}

/** 고른 파일을 업로드 파트로. web 은 File 객체, native 는 uri 파트로 보낸다 */
export function toFilePart(
  file: NonNullable<ResourceDraft["file"]>
): Blob | NativeFilePart {
  return Platform.OS === "web" && file.file
    ? file.file
    : {
        uri: file.uri,
        name: file.name,
        type: file.mimeType ?? "application/octet-stream",
      };
}

export function toReferenceParams({
  type,
  name,
  path,
  file,
}: ResourceDraft): CreateReferenceParams | null {
  if (type === "url") return { type, name, url: path };
  if (!file) return null;
  return { type, name: name || undefined, file: toFilePart(file) };
}
