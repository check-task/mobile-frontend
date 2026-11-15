# 라우팅 규칙

`app`은 route와 layout만 담당한다. 화면 UI는 `features/<feature>/components/*Screen.tsx`에 두고 `app`에서는 연결만 한다.

## 화면 진입점

홈(`/`)은 헤더만 표시하고 본문은 화면 연결 전까지 비워 둔다. 홈과 각 목록·공지·알림 화면의 헤더 메뉴 아이콘은 `/menu`를 연다. 메뉴의 `과제` 항목은 개인과제와 팀과제로 펼쳐지며, 각각 `/tasks?scope=personal`, `/tasks?scope=team`으로 이동한다. `scope`를 생략하거나 다른 값을 받으면 개인과제를 표시한다. 메뉴의 완료 과제 히스토리, 공지사항, 알림은 각각 `/tasks/completed`, `/notice`, `/notification`으로 이동한다.

## 과제 라우팅

개인 과제와 팀 과제는 같은 `tasks` 도메인에 두되, 상세 UI와 실시간 책임이 다르므로 route와 Screen을 분리한다. 수정 UI는 공통으로 관리한다.

| 경로                       | 연결 화면                  | 책임                      |
| -------------------------- | -------------------------- | ------------------------- |
| `/tasks/create`            | `TaskCreateScreen`         | 과제 생성                 |
| `/tasks`                   | `MyTasksScreen`            | 개인/팀 진행 과제 목록    |
| `/tasks/completed`         | `CompletedTasksScreen`     | 개인/팀 완료 과제 목록    |
| `/tasks/[taskId]/edit`     | `TaskEditScreen`           | 개인/팀 공통 과제 수정    |
| `/tasks/personal/[taskId]` | `PersonalTaskDetailScreen` | 개인 과제 상세            |
| `/tasks/team/[taskId]`     | `TeamTaskDetailScreen`     | 팀 과제 상세 및 실시간 UI |

- `taskId`는 수정할 리소스의 식별자이므로 query string이 아니라 path param으로 받는다.
- 수정 화면은 query string의 과제 타입을 신뢰하지 않고 해당 과제 정보의 실제 타입을 사용한다.
- 개인/팀 공통 UI는 `features/tasks/components`에서 공유하고 전용 UI는 `personal`, `team` 하위로 분리한다.
