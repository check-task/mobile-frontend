import { toDateKey as toLocalDateKey } from "@/lib/calendarDate";
import { toFolderColor } from "@/lib/folderColor";
import type { MyFolder } from "@/types/user.types";

import type { HomeFolder, HomeTasks } from "../components/homeData";

import type { TaskListResponse } from "./home.types";

/**
 * 서버 마감 → 캘린더 날짜 키(`YYYY-MM-DD`, 로컬).
 * `T23:59:59`·`2026.06.30` 은 날짜만 있는 마감이라 그대로, 그 외 시각은 타임존 없는 UTC 라 로컬 날짜로 바꾼다.
 */
function toDateKey(value: string) {
  if (!value.includes("T") || /T23:59:59/.test(value)) {
    return value.slice(0, 10).replace(/\./g, "-");
  }
  const utc = /(Z|[+-]\d\d:\d\d)$/i.test(value) ? value : `${value}Z`;
  return toLocalDateKey(new Date(utc));
}

export function toHomeTasks(data: TaskListResponse): HomeTasks {
  return {
    tasks: data.task.map((task) => ({
      id: task.taskId,
      folderId: task.folderId,
      folderName: task.folderTitle,
      color: toFolderColor(task.foldercolor),
      title: task.title,
      type: task.type,
      deadline: toDateKey(task.deadline),
      dDay: task.dDay,
      progressRate: task.progressRate,
    })),
    subTasks: data.subTask.map((subTask) => ({
      id: subTask.subTaskId,
      taskId: subTask.taskId,
      title: subTask.title,
      deadline: subTask.deadline && toDateKey(subTask.deadline),
    })),
  };
}

export function toHomeFolders(folders: MyFolder[]): HomeFolder[] {
  return folders.map((folder) => ({
    id: folder.folderId,
    name: folder.folderTitle,
    color: toFolderColor(folder.color),
  }));
}
