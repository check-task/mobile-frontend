// API 작업 전까지 임시로 사용할 더미 데이터
// TODO(api): GET /api/v1/task/{taskId} 응답을 TaskFormValue 로 바꿔 채운다
import type { TaskFormValue } from "../api/taskForm.types";

export const EDIT_TASK_DUMMY: TaskFormValue = {
  isTeam: false,
  title: "기말 프로젝트",
  // 개발 계정의 과제 266(빨강 폴더) 기준. 내 폴더 목록에 있는 id 여야 칩이 선택돼 보인다.
  folderId: 142,
  deadline: { date: new Date(2026, 11, 19, 9, 0), hasTime: true },
  subTasks: [1, 2, 3, 4].map((n) => ({
    id: `sub-${n}`,
    title: `TEST 1-${n}`,
    dueDate: { date: new Date(2026, 11, 19), hasTime: false },
  })),
  resources: [
    {
      id: "ref-1",
      type: "url",
      name: "참고 문서 1",
      path: "https://example.com",
    },
  ],
};
