import type { DocumentPickerAsset } from "expo-document-picker";

import type { DueDate } from "@/lib/dueDate";

/** 과제 등록·수정 폼 값. 화면 타입이지만 mapper·mutation 도 쓰므로 api/ 에 둔다 */

export type ResourceType = "file" | "url";

export type ResourceDraft = {
  type: ResourceType;
  name: string;
  /** 파일이면 파일 경로(이름), URL 이면 주소 */
  path: string;
  /** 파일 탭에서 고른 파일 */
  file?: DocumentPickerAsset;
};

export type SubTaskDraft = {
  id: string;
  title: string;
  dueDate: DueDate | null;
};

export type ResourceDraftItem = ResourceDraft & { id: string };

export type TaskFormValue = {
  isTeam: boolean;
  title: string;
  folderId: number | null;
  deadline: DueDate | null;
  subTasks: SubTaskDraft[];
  resources: ResourceDraftItem[];
};
