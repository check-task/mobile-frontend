# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## 작업별 문서

다음 작업을 하기 전에 해당 문서를 반드시 먼저 읽는다.

| 작업                                      | 문서                                    |
| ----------------------------------------- | --------------------------------------- |
| `app/`에 라우트 추가·수정                 | `docs/conventions/routing.md`           |
| 테마 토큰, `tailwind.config.js` 관련 작업 | `docs/conventions/theme.md`             |
| `components/common/` 컴포넌트 작성·수정   | `docs/conventions/common-components.md` |

커밋·PR·이슈·스토리 작성은 `.agents/skills/`의 스킬을 따른다.

## 파일 네이밍 컨벤션

| 대상          | 컨벤션                   | 예시                              |
| ------------- | ------------------------ | --------------------------------- |
| 컴포넌트 파일 | PascalCase               | `UserCard.tsx`                    |
| 화면 컴포넌트 | PascalCase + `Screen`    | `PersonalTaskDetailScreen.tsx`    |
| 라우트 파일   | kebab-case               | `user-profile.tsx`                |
| 동적 라우트   | 대괄호                   | `[userId].tsx`                    |
| 훅 파일       | camelCase + `use` 접두사 | `useAuthStore.ts`                 |
| 유틸/서비스   | camelCase                | `formatDate.ts`, `userService.ts` |
| 타입 파일     | camelCase + `.types`     | `user.types.ts`                   |
| 상수 파일     | camelCase                | `colors.ts`                       |
| 상수 값       | UPPER_SNAKE_CASE         | `MAX_RETRY_COUNT`                 |
| barrel export | `index.ts`               | `components/ui/index.ts`          |
| 아이콘        | 소문자 + `-` 조합        | `eye-close`                       |

## 폴더 구조

```text
├── app/                  # Expo Router route와 layout
├── assets/               # 이미지, 폰트 등 정적 리소스
├── components/           # 여러 feature가 공유하는 공용 UI
│   ├── common/
│   └── icons/
├── features/             # 기능 단위 코드
│   └── <feature>/
│       ├── components/   # 해당 feature 전용 Screen과 UI
│       └── hooks/        # 해당 feature 전용 hook
├── providers/            # 앱 전역 Provider와 UI Host
├── hooks/                # 여러 feature가 공유하는 공용 hook
├── lib/                  # 여러 기능이 공유하는 기반 및 범용 코드
├── store/                # 전역 클라이언트/UI Zustand 상태
├── constants/            # 전역 상수와 디자인 값
└── types/                # 여러 feature가 공유하는 type
```

`<feature>`는 실제 폴더명이 아니라 기능별 배치 규칙을 보여주는 자리표시자다. 합의된 빈 디렉터리를 먼저 만들 때는 `.gitkeep`을 두고, 실제 파일이 추가되면 제거한다.

### 폴더 책임

1. **`src`와 별도 `screens` 폴더는 사용하지 않는다.** 애플리케이션 코드는 프로젝트 루트 구조를 유지한다.
2. **`app`은 route와 layout만 담당한다.** route param/search param 처리, 접근 제어, navigation option, Screen 연결 외의 화면 UI와 비즈니스 로직은 넣지 않는다.
3. **실제 화면도 React 컴포넌트다.** `features/<feature>/components`에 두고 route와 연결되는 최상위 화면은 `*Screen.tsx`로 구분한다.
4. **기능 전용 컴포넌트는 `features/<feature>/components`에 둔다.** Screen과 해당 기능에서만 사용하는 UI 컴포넌트를 함께 관리한다.
5. **기능 전용 hook은 `features/<feature>/hooks`에 둔다.** 루트 `hooks`에는 여러 feature가 공유하는 도메인 비종속 hook만 둔다.
6. **현재 feature 하위에는 `components`와 `hooks`만 둔다.** 다른 하위 폴더는 필요성과 배치 기준을 팀에서 합의한 뒤 추가한다.
7. **`components/common`은 도메인 비종속 표현 UI만 둔다.** `app`, `features`, `store`, Router를 import하지 않는다.
8. **`providers`는 앱 최상단에 한 번 마운트되는 Provider와 Host를 둔다.** 기능별 화면 로직은 넣지 않는다.
9. **`lib`은 여러 기능이 공유하는 기반 코드와 범용 코드를 둔다.** 특정 feature의 비즈니스 로직은 넣지 않는다.
10. **합의된 기본 디렉터리는 `.gitkeep`으로 추적할 수 있다.** 실제 구현 파일이 추가되면 해당 폴더의 `.gitkeep`은 제거한다.

| 사용 범위                    | 컴포넌트 위치                   | hook 위치                  |
| ---------------------------- | ------------------------------- | -------------------------- |
| 특정 feature에서만 사용      | `features/<feature>/components` | `features/<feature>/hooks` |
| 여러 feature가 공통으로 사용 | `components/common`             | 루트 `hooks`               |

### 의존성 방향

```text
app -> features
app -> providers
features -> components/common + lib
providers -> store + components/common + lib
```

- `features`는 `app`을 import하지 않는다.
- `components/common`은 `features`, `app`, `store`를 import하지 않는다.
- feature 간 직접 import가 필요하면 공통 책임으로 승격할 코드인지 먼저 검토한다.
- 순환 참조를 만들지 않는다.

### 네비게이션 import

Expo Router(SDK 56+)에서는 앱 코드가 `@react-navigation/*`를 직접 import하면 번들링이 실패한다. 같은 API를 `expo-router` 경로에서 가져온다.

| 기존                            | 변경                           |
| ------------------------------- | ------------------------------ |
| `@react-navigation/native`      | `expo-router/react-navigation` |
| `@react-navigation/elements`    | `expo-router/react-navigation` |
| `@react-navigation/bottom-tabs` | `expo-router/js-tabs`          |

(참고: [Expo Router SDK 55 → 56 마이그레이션](https://docs.expo.dev/router/migrate/sdk-55-to-56/))

## 스타일 핵심 규칙

- 색상은 `tailwind.config.js`에 정의된 토큰 클래스만 쓴다 (`bg-bg`, `bg-primary`, `text-gray-900` 등). 모든 토큰은 CSS 변수라 다크모드에서 자동으로 바뀐다.
- 화면/컴포넌트 코드에 hex·rgb를 직접 쓰지 않고, `dark:` variant도 쓰지 않는다.
- 새 색상 토큰은 추가하지 않는다. 맞는 토큰이 없으면 임의로 비슷한 토큰을 고르거나 추가하지 말고 사용자에게 확인한다.

## 커밋 메시지

형식은 `태그: 내용`. 태그는 영문 소문자, 내용은 한국어로 쓴다 (예: `docs: 의존성 방향 명확화`). 태그 목록과 작성 절차는 `write-commit` 스킬을 따른다.
