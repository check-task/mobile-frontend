export type DueDate = {
  date: Date;
  /** `시간 추가`를 켰는지. 끄면 날짜만 의미가 있다. */
  hasTime: boolean;
};

/** 실제 마감 시각. 시간을 지정하지 않았으면 그날 23:59 로 본다. */
export function toDueDateTime({ date, hasTime }: DueDate) {
  const result = new Date(date);
  if (!hasTime) result.setHours(23, 59, 0, 0);
  return result;
}

const pad = (value: number) => String(value).padStart(2, "0");

/** 오늘 날짜(시간 없음). 시간 추가를 켰을 때 Figma 처럼 오전 00:00 부터 시작하도록 자정으로 맞춘다. */
export function todayDueDate(): DueDate {
  const now = new Date();
  return {
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    hasTime: false,
  };
}

/** `25.10.22` */
export function formatShortDate(date: Date) {
  return `${pad(date.getFullYear() % 100)}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

/** `오후 03:00`. 피커 시간 칩과 같은 00~11 표기 (자정 = 오전 00:00) */
export function formatDueTime(date: Date) {
  const hours = date.getHours();
  const period = hours < 12 ? "오전" : "오후";
  return `${period} ${pad(hours % 12)}:${pad(date.getMinutes())}`;
}
