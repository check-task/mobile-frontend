# 공용 컴포넌트 작성 규칙 (`components/common`)

`components/common`은 화면(`screens`)·라우트(`app`)에 종속되지 않는 **재사용 UI**를 둔다.
루트 [AGENTS.md](../../AGENTS.md)의 네이밍/컬러 규칙이 상위 규칙이고, 이 문서는 그 위에 얹는 컴포넌트 전용 규칙이다.

전제 스택: **React 19.1 / React Native 0.81 / Expo 54 / NativeWind 4.2 / TypeScript 5.9(`strict: true`)**.

## 0. 여기에 둘 것 / 두지 말 것

| 둔다                                              | 두지 않는다                                       |
| ------------------------------------------------- | ------------------------------------------------- |
| 도메인 데이터를 모르는 표현용(presentational) UI  | API 호출, react-query 훅, zustand store 구독      |
| props로만 동작이 결정되는 컴포넌트                | 라우팅(`router.push`) 직접 호출                   |
| 여러 화면에서 2회 이상 쓰이거나 쓰일 게 확실한 것 | 한 화면 전용 조각 → `screens/<화면>/` 아래에 둔다 |
| 내부 UI 상태(열림/포커스 등)                      | 비즈니스 상태(서버 데이터, 로그인 여부 등)        |

- 데이터는 **위에서 주입**하고, 사건은 **콜백으로 위로 올린다**. 공용 컴포넌트 안에서 부수효과를 일으키지 않는다.
- 아이콘은 여기가 아니라 `components/icons`에 두고 kebab-case 파일명을 쓴다(루트 규칙).
- **도메인 결합 여부는 이름이 아니라 import 목록으로 판단한다.** `TaskCard`, `FolderFilterItem`처럼 도메인 이름을 가진 컴포넌트라도 API·store·라우팅·도메인 엔티티 타입에 의존하지 않고 props(원시값)로만 동작하면 여기에 둔다. Figma 컴포넌트 세트에 대응하는 UI는 도메인 이름을 그대로 쓰고, variant는 §3대로 문자열 유니온으로 옮긴다. 고정 문구·고정 아이콘 같은 Figma 확정 콘텐츠를 굳이 prop으로 열어 호출부로 흩지 않는다. (§4-5의 "공용 컴포넌트가 도메인을 모르게 유지"는 **도메인 객체 배열을 받는 리스트/컬렉션 컴포넌트**에 한정된 규칙이다.)

## 1. 파일 구성

**컴포넌트 하나당 폴더 하나**를 만들고, 그 안에 파일 2종을 둔다.

```
components/common/
├── TaskCard/
│   ├── TaskCard.tsx           # 컴포넌트 본체 + 타입
│   └── TaskCard.stories.tsx   # 스토리북 스토리
└── Toast/
    ├── Toast.tsx
    └── Toast.stories.tsx
```

- 폴더명·파일명 모두 **PascalCase**이고 export하는 컴포넌트 이름과 정확히 같다. (`TaskCard/TaskCard.tsx` → `TaskCard`)
- 컴포넌트 전용 하위 컴포넌트·훅·상수가 생기면 **그 컴포넌트 폴더 안에** 둔다. 두 개 이상의 컴포넌트가 쓰게 되면 `components/common` 바로 아래로 올린다.
- 타입은 별도 `.types.ts`로 빼지 않고 **컴포넌트 파일 안에 같이 두고 export**한다. 두 개 이상의 컴포넌트가 공유하게 된 시점에 `types/`로 분리한다.
- **`components/common`에는 barrel(`index.ts`)을 두지 않는다.** 폴더별 `index.ts`도 만들지 않고, 컴포넌트는 파일 경로로 직접 가져온다.

  ```tsx
  import { TaskCard } from "@/components/common/TaskCard/TaskCard";
  ```

  Metro는 tree-shaking을 하지 않아 barrel 하나를 import하면 거기서 re-export하는 모든 컴포넌트 모듈이 함께 로드된다. 형제 컴포넌트끼리 참조할 때 순환 참조가 생기는 문제도 있다. (아이콘은 한 번에 여러 개를 쓰고 파일 단위가 작아 `@/components/icons` barrel을 유지한다.)

- 한 파일에 컴포넌트 하나가 원칙. 밖에서 못 쓰는 보조 컴포넌트만 같은 파일에 두되 export하지 않는다.

## 2. import 순서

외부 패키지 → 빈 줄 → 프로젝트 절대경로(`@/`) → 빈 줄 → 같은 폴더 상대경로. 그룹 안은 알파벳 순.

```tsx
import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { Check } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";
```

- 프로젝트 내부 모듈은 `@/` 별칭. 상대경로는 **같은 컴포넌트 폴더 안**(`./TaskCardBadge`)과 **형제 공용 컴포넌트**(`../FolderColorDot/FolderColorDot`)까지만 쓴다.
- 아이콘은 개별 파일이 아니라 `@/components/icons` barrel에서 가져온다.
- 타입만 쓰는 import는 **`import type`**으로 분리한다.

## 3. props 설계

```tsx
/** 카드 상태. Figma variant와 1:1로 대응한다. */
export type TaskCardStatus = "todo" | "doing" | "done";

export type TaskCardProps = {
  /** 카드 제목 */
  title: string;
  /** 진행 상태 (기본값: `todo`) */
  status?: TaskCardStatus;
  /** 카드를 탭했을 때 */
  onPress?: () => void;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};
```

- `interface`가 아니라 **`type`**으로 선언하고, 이름은 `<Component>Props`로 고정한다.
- **props는 최소 집합만 연다.** "언젠가 쓸 것 같아서" 여는 prop 금지. 지우는 것보다 나중에 추가하는 게 싸다.
- Figma variant는 **문자열 유니온 타입**으로 옮기고 타입 별칭을 붙여 export한다. `isNew`, `isRead` 같은 boolean 여러 개로 쪼개지 않는다(불가능한 조합이 타입에 생긴다).
- 기본값은 구조분해 할당에서 준다(`status = "todo"`). `defaultProps` 금지.
- 핸들러는 `on<Event>` 네이밍. **선택적 핸들러는 "안 넘기면 해당 UI를 렌더링하지 않는다"** 규칙으로 동작시킨다.
- **`className`은 항상 마지막 prop.** 바깥 여백·레이아웃 보정용이며 호출부가 최종 우선권을 갖는다.
- 스타일 override용 `style` prop은 열지 않는다(`constants/`의 이펙트 상수를 컴포넌트 내부에서 쓰는 경우 제외).
- `children`이 필요하면 `children: ReactNode`로 **명시적으로 선언**한다. `React.FC`의 암묵적 children에 의존하지 않는다.

## 4. 타입 안전 규칙 (이 문서의 핵심)

### 4-1. 금지 목록

- `any` 금지. 모르는 값은 `unknown`으로 받고 좁혀서 쓴다.
- `as` 단언 금지. 대신 **`satisfies`**를 쓴다. 불가피하면 왜 필요한지 주석을 남긴다.
- `!`(non-null assertion) 금지. optional은 조건 분기로 처리한다.
- `@ts-ignore` 금지. 정말 필요하면 `@ts-expect-error` + 한 줄 사유.
- prop 타입에 넓은 `string`/`number`를 쓰지 않는다. 값 집합이 정해져 있으면 유니온으로 좁힌다.

### 4-2. variant → 클래스 매핑은 `Record`로 강제한다

`switch`나 조건 나열 대신 **키 누락이 컴파일 에러가 되는 lookup 객체**를 쓴다.

```tsx
const STATUS_CLASS: Record<TaskCardStatus, string> = {
  todo: "bg-gray-100",
  doing: "bg-blue-50",
  done: "opacity-40",
};

// 사용
className={cn("rounded-lg px-3 py-4", STATUS_CLASS[status], className)}
```

- variant를 하나 추가하면 매핑 누락이 즉시 에러로 잡힌다.
- 사이즈 등 숫자 값도 동일하게: `const ICON_SIZE = { sm: 16, md: 20, lg: 24 } as const satisfies Record<Size, number>`.
- 리터럴 타입을 상수에서 파생시키고 싶으면 `as const` + `keyof typeof`를 쓴다. (`components/icons/icon.types.ts`의 `ICON_SIZES` 참고)

### 4-3. 불가능한 조합은 discriminated union으로 막는다

props 조합 중 "동시에 오면 안 되는 것"이 있으면 optional 나열이 아니라 유니온으로 표현한다.

```tsx
type ButtonBase = {
  variant?: ButtonVariant;
  onPress: () => void;
  className?: string;
};

export type ButtonProps = ButtonBase &
  (
    | { label: string; icon?: never }
    // 아이콘만 있는 버튼은 accessibilityLabel을 타입 레벨에서 필수로 만든다.
    | { label?: never; icon: ReactNode; accessibilityLabel: string }
  );
```

호출부가 잘못된 조합을 넘기면 런타임이 아니라 **타입 체크에서** 막힌다.

### 4-4. RN 컴포넌트를 감쌀 때는 props를 파생시킨다

```tsx
type PressableProps = ComponentProps<typeof Pressable>;

export type TaskCardProps = Omit<
  PressableProps,
  "style" | "className" | "children"
> & {
  title: string;
  className?: string;
};
```

- 손으로 다시 적지 않는다. `ComponentProps<typeof X>`로 뽑고, **우리가 통제하는 prop만 `Omit`** 한다.
- 전부 pass-through 하지 말고 필요한 것만 연다. `{...rest}`를 무분별하게 퍼뜨리면 `style`이 뒷문으로 들어온다.
- ref가 필요하면 React 19이므로 `forwardRef` 없이 **`ref?: Ref<View>`를 그냥 prop으로** 받는다.

### 4-5. 리스트/제네릭

```tsx
export type ChipListProps<T> = {
  /** 렌더링할 항목. 컴포넌트가 배열을 변형하지 않음을 타입으로 보장한다. */
  items: readonly T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  onSelect?: (item: T) => void;
  className?: string;
};

export function ChipList<T>({ items, getKey, ... }: ChipListProps<T>) { ... }
```

- 배열 prop은 **`readonly T[]`**로 받는다.
- 항목 타입을 `any`나 도메인 타입으로 고정하지 말고 제네릭 + accessor 함수로 연다(공용 컴포넌트가 도메인을 모르게 유지).
- 화살표 함수 제네릭은 `.tsx`에서 JSX와 충돌하므로 **`function` 선언**을 쓴다(이 프로젝트 기본 규칙과 동일).

### 4-6. 이벤트 타입

- RN 이벤트 핸들러 시그니처는 직접 적지 말고 RN 타입을 쓴다. (`GestureResponderEvent`, `NativeSyntheticEvent<TextInputChangeEventData>` 등)
- 호출부가 이벤트 객체를 쓸 필요가 없으면 `() => void`로 좁혀서 노출한다.

## 5. 너비/레이아웃

- **컴포넌트가 자기 너비를 지정하지 않는다.** Figma의 고정 폭(예: 358px = 화면 좌우 20px 여백)은 부모가 결정한다.
- 내부는 `flex-1` + `gap-*`으로 짠다. 고정 px 마진 대신 `gap`.
- 컴포넌트 자신에게 바깥 여백(`m-*`)을 넣지 않는다. 배치는 호출부 책임이다.
- 세로/가로 패딩은 Figma 값을 그대로 tailwind spacing으로 옮긴다(`px-3 py-4`).

## 6. 스타일링

- 클래스 조합은 반드시 **`cn()`**(`@/lib/utils`)을 통과시킨다. 템플릿 리터럴로 이어붙이지 않는다(tailwind-merge가 충돌을 정리해야 `className` override가 실제로 이긴다).

  ```tsx
  className={cn(
    "flex-row items-center gap-2 rounded-lg px-3 py-4",
    STATUS_CLASS[status],
    className
  )}
  ```

  순서는 **기본 클래스 → 상태별 조건부 클래스 → `className`(호출부 override)** 로 고정한다.

- 색상은 디자인 토큰 클래스만 쓴다(`bg-blue-50`, `text-gray-900`, `bg-primary`). hex/rgb 직접 입력 금지, **`dark:` variant 금지**(테마는 `constants/theme-vars.ts`가 CSS 변수로 처리한다).
- 타이포그래피는 `text-b-02-m`, `text-h-03` 같은 **텍스트 스타일 유틸리티**로 지정한다. `text-sm font-medium`처럼 개별 속성을 조합하지 않는다. 색상 클래스와 함께 쓸 때는 `text-gray-900 text-b-02-m` 순.
- className으로 표현할 수 없는 값(그림자 offset/opacity 등)은 `constants/`의 JS 상수를 `style`로 넘긴다. 컴포넌트 안에서 인라인 스타일 객체를 새로 만들지 않는다.

  ```tsx
  <Pressable style={CARD_SHADOW} className={cn(...)}>
  ```

  새 이펙트가 필요하면 `constants/shadows.ts` 등에 `satisfies ViewStyle`을 붙여 상수를 추가하고, 왜 className으로 못 하는지 주석을 남긴다.

## 7. 아이콘 사용

- 크기는 `variant`(`sm`/`md`/`lg`), 색상은 `className`으로 준다. `width`/`height`/`color` 직접 지정은 예외적인 경우에만.

  ```tsx
  <Check className="text-blue-500" />
  <Cancel variant="sm" className="text-gray-600" />
  ```

- 아이콘을 prop으로 받을 때는 엘리먼트(`icon: ReactNode`)로 받는다. 컴포넌트 타입(`ComponentType`)으로 받으면 크기/색 지정 책임이 애매해진다.

## 8. 접근성

- 탭 가능한 요소에는 `accessibilityRole="button"`. **핸들러가 optional이면 role도 조건부로** 준다.

  ```tsx
  accessibilityRole={onPress ? "button" : undefined}
  ```

- 아이콘만 있는 버튼에는 한국어 `accessibilityLabel`을 반드시 붙인다. 재사용 컴포넌트라면 4-3처럼 **타입으로 필수화**한다.
- 작은 아이콘 버튼에는 `hitSlop={8}`.
- 비활성 상태는 `disabled` + `accessibilityState={{ disabled }}`를 함께 준다. 시각적으로만 흐리게 처리하지 않는다.
- 중첩된 `Pressable`(카드 안의 닫기 버튼)은 허용한다. 내부 `onPress`가 우선한다.

## 9. 컴포넌트 선언

- **`export default` 금지.** named export의 `function` 선언을 쓴다. (`export function TaskCard(...)`)
- `React.FC` / `memo`를 기본으로 붙이지 않는다. 성능 문제가 실측된 뒤에 붙인다.
- 반환 타입을 명시하지 않는다(추론에 맡긴다). `JSX.Element` 수동 annotation 금지.
- 조건부 렌더링은 `&&`가 아니라 **삼항 + `null`**로 쓴다. RN에서 falsy 값(`0`, `""`)이 텍스트로 새는 것을 막는다.

  ```tsx
  {onDismiss ? <Pressable ... /> : null}
  ```

- 모든 텍스트는 `<Text>` 안에 넣는다. `<View>` 직속 문자열 금지.

## 10. 주석 / JSDoc

- 컴포넌트와 모든 public prop에 **한국어 JSDoc**을 단다. prop 주석에는 기대값 예시와 기본값을 함께 적는다.

  ```tsx
  /** 진행 상태. `done`이면 전체가 흐리게 표시된다. (기본값: `todo`) */
  status?: TaskCardStatus;
  ```

- 컴포넌트 JSDoc에는 **한 줄 요약 + 사용 시 주의사항**(너비는 부모가 정한다 등)을 적는다.
- Figma에서 온 값(variant 이름, 고정 폭, 이펙트)은 근거를 주석으로 남긴다.
- 타입 alias에도 JSDoc을 단다. 스토리북 autodocs와 에디터 자동완성에 그대로 노출된다.

## 11. 스토리 작성

```tsx
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { TaskCard } from "./TaskCard";

const meta = {
  title: "Common/TaskCard",
  component: TaskCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: { control: "inline-radio", options: ["todo", "doing", "done"] },
  },
  args: {
    // Figma에 적힌 실제 문구를 그대로
  },
  decorators: [
    (Story) => (
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TaskCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태. */
export const Default: Story = {};
```

- `title`은 `Common/<ComponentName>`. 폴더가 바뀌면 접두사도 바뀐다(`Icons/…`).
- **`satisfies Meta<typeof X>` + `StoryObj<typeof meta>`** 조합을 쓴다. `as Meta` 캐스팅 금지 — `satisfies`를 써야 `args`의 오타·누락이 잡힌다.
- 유니온 prop은 `argTypes`에 `inline-radio` 컨트롤을 달아준다.
- 컴포넌트가 너비를 안 정하므로 **decorator에서 실제 화면 폭(`w-[358px]`)을 재현**한다.
- 스토리는 최소 이 4종을 덮는다: **기본 상태 / 각 variant / optional prop 생략 / 여러 개 나열(List)**.
- 각 story에 한 줄 JSDoc을 달면 autodocs에 설명으로 노출된다.
- 더미 텍스트는 Figma 문구를 그대로 쓴다.

## 12. 커밋 전 확인

```bash
npm run typecheck   # tsc --noEmit
npm run lint
```

새 컴포넌트를 추가한 커밋은 `ui:` 또는 `feat:` 태그를 쓴다(루트 규칙).

## 체크리스트

- [ ] `<Component>/` 폴더 안에 PascalCase 파일명 = export 컴포넌트명, `export default` 없음
- [ ] `<Component>Props` **type**, 마지막 prop이 `className`
- [ ] `any` / `as` / `!` / `@ts-ignore` 없음
- [ ] variant는 문자열 유니온, 매핑은 `Record<Variant, …>`로 누락 방지
- [ ] 불가능한 props 조합은 discriminated union으로 차단
- [ ] RN 컴포넌트 래핑 시 `ComponentProps<typeof X>` + `Omit`으로 파생
- [ ] 배열 prop은 `readonly`, 도메인 타입 대신 제네릭
- [ ] 자기 너비/바깥 여백을 지정하지 않음
- [ ] 모든 클래스가 `cn()`을 통과, 순서는 base → 조건부 → `className`
- [ ] 색상/타이포 전부 토큰 클래스, hex·`dark:` 없음
- [ ] 아이콘은 `variant` + `className`
- [ ] 탭 요소에 role, 아이콘 버튼에 한국어 label + `hitSlop`
- [ ] 컴포넌트/prop/타입에 한국어 JSDoc, Figma 근거 주석
- [ ] `.stories.tsx` 작성 (기본/variant/생략/List), `satisfies Meta`
- [ ] `npm run typecheck` / `npm run lint` 통과
