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
