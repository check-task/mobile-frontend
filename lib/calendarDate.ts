const KOREAN_WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** 로컬 날짜 → `YYYY-MM-DD` (API 날짜 형식과 같다) */
export function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** `YYYY-MM-DD` → `5월 31일 (일)` */
export function formatDayTitle(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const weekday = KOREAN_WEEKDAYS[new Date(year, month - 1, day).getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

/** 그 달 1일이 들어 있는 주의 일요일부터 6주(42일) */
export function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  return Array.from(
    { length: 42 },
    (_, index) => new Date(year, month, 1 - first.getDay() + index)
  );
}
