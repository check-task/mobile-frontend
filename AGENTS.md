# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

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

## 폴더 구조 (확정 🙋🏻‍♀️)

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
app -> features -> components/common + lib
providers -> store + components/common + lib
```

- `features`는 `app`을 import하지 않는다.
- `components/common`은 `features`, `app`, `store`를 import하지 않는다.
- feature 간 직접 import가 필요하면 공통 책임으로 승격할 코드인지 먼저 검토한다.
- 순환 참조를 만들지 않는다.

### 과제 라우팅

개인 과제와 팀 과제는 같은 `tasks` 도메인에 두되, 상세 UI와 실시간 책임이 다르므로 route와 Screen을 분리한다. 수정 UI는 공통으로 관리한다.

| 경로                       | 연결 화면                  | 책임                      |
| -------------------------- | -------------------------- | ------------------------- |
| `/tasks/create`            | `TaskCreateScreen`         | 과제 생성                 |
| `/tasks/[taskId]/edit`     | `TaskEditScreen`           | 개인/팀 공통 과제 수정    |
| `/tasks/personal/[taskId]` | `PersonalTaskDetailScreen` | 개인 과제 상세            |
| `/tasks/team/[taskId]`     | `TeamTaskDetailScreen`     | 팀 과제 상세 및 실시간 UI |

- `taskId`는 수정할 리소스의 식별자이므로 query string이 아니라 path param으로 받는다.
- 수정 화면은 query string의 과제 타입을 신뢰하지 않고 해당 과제 정보의 실제 타입을 사용한다.
- 개인/팀 공통 UI는 `features/tasks/components`에서 공유하고 전용 UI는 `personal`, `team` 하위로 분리한다.

## 커밋 메시지 컨벤션

형식: `태그: 커밋 내용` — 태그와 내용 모두 소문자로 작성.

| 커밋 유형 | 의미                     |
| --------- | ------------------------ |
| feat      | 새로운 기능 추가         |
| fix       | 버그 수정                |
| ui        | UI 컴포넌트 추가/수정    |
| design    | 스타일링 변경            |
| docs      | 문서 수정                |
| refactor  | 코드 리팩토링            |
| test      | 테스트 코드              |
| chore     | 패키지 매니저, 기타 잡일 |
| setting   | 환경설정, config 수정    |
| build     | 빌드 관련                |
| asset     | 리소스 추가/교체         |
| comment   | 주석 작업                |
| rename    | 파일/폴더명 변경         |
| remove    | 파일 삭제                |
| hotfix    | 긴급 버그 수정           |
| release   | 릴리즈                   |

## 컬러/테마 컨벤션 (NativeWind semantic tokens)

이 프로젝트는 NativeWind 4.2.6 + Tailwind 3.4.19를 사용하며, 색상은 고정 hex/팔레트 이름이 아니라 **CSS 변수 기반 semantic token**으로 관리합니다.
(참고: [NativeWind Themes](https://www.nativewind.dev/docs/guides/themes), [vars() API](https://www.nativewind.dev/docs/api/vars))

### 컬러 규칙

1. **`tailwind.config.js`에 색상을 직접 hex로 넣지 않는다.** 반드시 `rgb(var(--color-x) / <alpha-value>)` 형태의 semantic token으로 정의한다.

   ```js
   colors: {
     bg: 'rgb(var(--color-bg) / <alpha-value>)',
     surface: 'rgb(var(--color-surface) / <alpha-value>)',
     text: 'rgb(var(--color-text) / <alpha-value>)',
     muted: 'rgb(var(--color-muted) / <alpha-value>)',
     border: 'rgb(var(--color-border) / <alpha-value>)',
     primary: 'rgb(var(--color-primary) / <alpha-value>)',
   }
   ```

2. **라이트/다크 값은 `nativewind`의 `vars()`로 `constants/theme-vars.ts`(가칭)에 따로 정의한다.** 값은 `#FCFCFD`가 아니라 `252 252 253`처럼 공백 구분 RGB 숫자로 쓴다 (alpha 합성을 위해 필수).

   ```ts
   import { vars } from "nativewind";

   export const lightTheme = vars({
     "--color-bg": "252 252 253",
     "--color-text": "9 10 11",
     // ...
   });

   export const darkTheme = vars({
     "--color-bg": "8 18 33",
     "--color-text": "255 255 255",
     // ...
   });
   ```

3. **테마 변수는 앱 루트(`app/_layout.tsx` 근처)의 `ThemeVariablesProvider`에서 한 번만 주입한다.** `useColorScheme()`으로 현재 스킴을 읽어 `style={colorScheme === 'dark' ? darkTheme : lightTheme}`을 최상위 `View`에 적용하고, 하위 화면/컴포넌트는 이 provider로 감싸져 있다고 가정한다.

4. **화면/컴포넌트에서는 `dark:` variant를 쓰지 않는다.** semantic token 클래스만 사용한다: `bg-bg`, `text-text`, `border-border`, `bg-surface`, `text-muted`, `bg-primary` 등. 새 색상이 필요하면 먼저 semantic token을 추가할지 검토하고, 필요에 따라서 화면 코드에 직접 hex/rgb 값을 추가하도록 한다.
5. **React Navigation 등 JS prop으로 색상을 넘겨야 하는 곳** (`tabBarActiveTintColor` 등)은 className으로 처리할 수 없으므로, 같은 semantic 값을 상수(JS 값)로도 노출해 별도 매핑한다. Tailwind 클래스와 JS 상수의 값이 어긋나지 않도록 동일한 소스(`theme-vars`)에서 파생시킨다.

6. **기존 `gray.900`, `gray.900-dark` 같은 팔레트 중심 네이밍은 새로 추가하지 않는다.** 이미 존재하는 팔레트 토큰을 지우라는 뜻은 아니지만, 신규 스타일링은 semantic token 기준으로 작성한다.

### 왜 이렇게 하는가

- 화면마다 `dark:` 반복을 줄이고, 색상 정책을 한 곳(`theme-vars`)에 모으기 위함.
- 다크모드뿐 아니라 추후 브랜드 테마 추가를 쉽게 하기 위함.
- `bg-bg`, `text-text`, `border-border`처럼 의미 기반 스타일 작성을 강제하기 위함.
