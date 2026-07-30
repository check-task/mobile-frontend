# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

## 파일 네이밍 컨벤션

| 대상          | 컨벤션                   | 예시                              |
| ------------- | ------------------------ | --------------------------------- |
| 컴포넌트 파일 | PascalCase               | `UserCard.tsx`                    |
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

```
├── app/            # 앱 라우터
├── assets/         # 이미지, 폰트 등 정적 리소스
├── components/     # 재사용 가능한 공통 UI 컴포넌트
│   ├── common/     # 공통 컴포넌트
│   ├──icons/       # 아이콘 컴포넌트
│   ├──ui/          # UI 컴포넌트
├── screens/        # 페이지 단위 컴포넌트
├── hooks/          # 커스텀 훅
├── navigation/     # 라우팅 관련 설정
├── apis/           # API 호출, 외부 라이브러리 연동
├── store/          # 상태 관리 (Zustand, Redux 등)
├── utils/          # 유틸 함수
├── constants/      # 색상, 여백, 공통 스타일 값
└── types/          # 타입스크립트 타입 정의
```

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
