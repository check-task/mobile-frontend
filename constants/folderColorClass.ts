import type { FolderColor } from "@/types/folder.types";

// NativeWind 는 클래스 이름을 정적으로 읽어야 해서 색마다 풀어서 적는다.
export const FOLDER_BG_CLASS: Record<FolderColor, string> = {
  "sub-01": "bg-sub-01",
  "sub-02": "bg-sub-02",
  "sub-03": "bg-sub-03",
  "sub-04": "bg-sub-04",
  "sub-05": "bg-sub-05",
  "sub-null": "bg-sub-null",
};

export const FOLDER_BORDER_CLASS: Record<FolderColor, string> = {
  "sub-01": "border-sub-01",
  "sub-02": "border-sub-02",
  "sub-03": "border-sub-03",
  "sub-04": "border-sub-04",
  "sub-05": "border-sub-05",
  "sub-null": "border-sub-null",
};

export const FOLDER_TEXT_CLASS: Record<FolderColor, string> = {
  "sub-01": "text-sub-01",
  "sub-02": "text-sub-02",
  "sub-03": "text-sub-03",
  "sub-04": "text-sub-04",
  "sub-05": "text-sub-05",
  "sub-null": "text-sub-null",
};
