import type { FolderColor } from "@/types/folder.types";

// 디자인 토큰(constants/theme-vars.ts 라이트 값)과 hex 가 같을 때만 매핑한다.
const FOLDER_COLOR_BY_HEX: Record<string, FolderColor> = {
  "#F55757": "sub-01",
  "#FFC93F": "sub-02",
  "#6EC77B": "sub-03",
  "#A177E2": "sub-04",
  "#081221": "sub-05",
};

/** 서버 폴더 색(hex 또는 "값 없음") → 폴더 색 토큰 */
export function toFolderColor(hex: string): FolderColor {
  return FOLDER_COLOR_BY_HEX[hex.toUpperCase()] ?? "sub-null";
}

/** 폴더 색 토큰 → 서버에 보낼 hex. `sub-null` 은 `지정안함` 전용이라 고를 수 없다 */
export function toFolderHex(color: FolderColor) {
  const hex = Object.keys(FOLDER_COLOR_BY_HEX).find(
    (key) => FOLDER_COLOR_BY_HEX[key] === color
  );
  if (!hex) throw new Error(`hex 가 없는 폴더 색: ${color}`);
  return hex;
}
