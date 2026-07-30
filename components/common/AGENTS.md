# 공용 컴포넌트 작성 규칙 (`components/common`)

`components/common/AlarmItem.tsx`를 레퍼런스로 삼는다. 새 공용 컴포넌트는 아래 규칙을 그대로 따른다.
루트 [AGENTS.md](../../AGENTS.md)의 컬러/네이밍 규칙이 상위 규칙이며, 이 문서는 그 위에 얹는 컴포넌트 전용 규칙이다.

## 1. 파일 구성

컴포넌트 하나당 파일 3종을 세트로 만든다.

| 파일                    | 역할                             |
| ----------------------- | -------------------------------- |
| `AlarmItem.tsx`         | 컴포넌트 본체 + 타입             |
| `AlarmItem.stories.tsx` | 스토리북 스토리                  |
| `index.ts`              | barrel export (기존 파일에 추가) |

- 파일명은 루트 규칙대로 **PascalCase**이고, export하는 컴포넌트 이름과 동일하게 맞춘다. (`AlarmItem.tsx` → `AlarmItem`)
  - 아이콘(`components/icons`)만 예외로 `eye-close.tsx` 같은 kebab-case를 쓴다. 루트 AGENTS.md의 "아이콘" 규칙.
- 타입은 별도 `.types.ts`로 빼지 않고 **컴포넌트 파일 안에 같이 둔다**. 여러 컴포넌트가 공유하게 되면 그때 분리한다.
- `index.ts`에는 값과 타입을 각각 한 줄씩 export한다.

  ```ts
  export { AlarmItem } from "./AlarmItem";
  export type { AlarmItemProps, AlarmItemStatus } from "./AlarmItem";
  ```

## 2. import 순서

`react-native` → 빈 줄 → 프로젝트 절대경로(`@/`) 순으로 그룹을 나눈다. 그룹 안은 알파벳 순.

```tsx
import { Pressable, Text, View } from "react-native";

import { AlarmDefault, Cancel } from "@/components/icons";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";
```

- 프로젝트 내부 모듈은 상대경로가 아니라 `@/` 별칭을 쓴다. 단, **같은 폴더 안**(`./AlarmItem`)은 상대경로.
- 아이콘은 개별 파일이 아니라 `@/components/icons` barrel에서 가져온다.

## 3. props 설계

```tsx
/** 알림 읽음 상태. Figma `(mobile) 알림`의 `Property 1` variant와 대응한다. */
export type AlarmItemStatus = "new" | "read";

export type AlarmItemProps = {
  title: string;
  status?: AlarmItemStatus;
  onPress?: () => void;
  onDismiss?: () => void;
  className?: string;
};
```

- `interface`가 아니라 **`type`**으로 선언하고, 이름은 `<Component>Props`.
- Figma variant는 **문자열 유니온 타입**으로 옮기고, 타입 별칭(`AlarmItemStatus`)으로 이름을 붙여 export한다. boolean 여러 개로 쪼개지 않는다.
- 기본값은 구조분해 할당에서 준다(`status = "new"`). `defaultProps` 금지.
- 핸들러는 `on<Event>` 네이밍. **선택적 핸들러는 "안 넘기면 그 UI를 렌더링하지 않는다"** 는 규칙으로 동작시킨다. (`onDismiss`가 없으면 X 버튼 없음)
- **`className`을 항상 마지막 prop으로 받는다.** 바깥 여백·레이아웃 보정용이며, 호출부가 최종 우선권을 갖는다.
- 스타일 override용 `style` prop은 열지 않는다. 필요한 건 `className`으로 받는다.

## 4. 너비/레이아웃

- **컴포넌트가 자기 너비를 지정하지 않는다.** Figma의 고정 폭(예: 358px = 화면 좌우 20px 여백)은 부모가 결정한다.
- 내부는 `flex-1` + `gap-*`으로 짠다. 고정 px 마진 대신 `gap`을 쓴다.
- 세로 여백/가로 여백은 Figma 값을 그대로 tailwind spacing으로 옮긴다(`px-3 py-4`).

## 5. 스타일링

- 클래스 조합은 반드시 **`cn()`** (`@/lib/utils`)을 통과시킨다. 템플릿 리터럴로 이어붙이지 않는다.

  ```tsx
  className={cn(
    "flex-row items-center justify-between gap-2 rounded-lg bg-blue-50 px-3 py-4",
    status === "read" && "opacity-40",
    className
  )}
  ```

  순서는 **기본 클래스 → 상태별 조건부 클래스 → `className`(호출부 override)** 고정.

- 색상은 디자인 토큰 클래스만 쓴다(`bg-blue-50`, `text-gray-900`, `text-gray-600`). hex/rgb 직접 입력 금지, `dark:` variant 금지.
- 타이포그래피는 `text-b-02-m`, `text-h-03` 같은 **텍스트 스타일 유틸리티**로 지정한다. `text-sm font-medium`처럼 개별 속성을 조합하지 않는다. (색상 클래스와 함께 쓸 때는 `text-gray-900 text-b-02-m` 순)
- className으로 표현할 수 없는 값(그림자 offset/opacity 등)은 `constants/`의 JS 상수를 `style`로 넘긴다. 컴포넌트 안에서 인라인 객체를 새로 만들지 않는다.

  ```tsx
  <Pressable style={CARD_SHADOW} className={...}>
  ```

  새로운 이펙트가 필요하면 `constants/shadows.ts` 등에 상수를 추가하고 왜 className으로 못 하는지 주석을 남긴다.

## 6. 아이콘 사용

- 크기는 `variant`(`sm`/`md`/`lg`), 색상은 `className`으로 준다. `width`/`height`/`color` prop 직접 지정은 예외적인 경우에만.

  ```tsx
  <AlarmDefault className="text-blue-500" />
  <Cancel className="text-gray-600" />
  ```

## 7. 접근성

- 탭 가능한 요소에는 `accessibilityRole="button"`을 붙인다. **핸들러가 optional이면 role도 조건부로** 준다.

  ```tsx
  accessibilityRole={onPress ? "button" : undefined}
  ```

- 아이콘만 있는 버튼에는 한국어 `accessibilityLabel`을 반드시 붙인다(`"알림 닫기"`).
- 작은 아이콘 버튼에는 `hitSlop={8}`을 준다.
- 중첩된 `Pressable`(카드 안의 닫기 버튼)은 그대로 허용한다. 내부 `onPress`가 우선한다.

## 8. 주석 / JSDoc

- 컴포넌트와 모든 public prop에 **한국어 JSDoc**을 단다. prop 주석에는 기대값 예시와 기본값을 함께 적는다.

  ```tsx
  /** 읽음 상태. `read`면 전체가 흐리게 표시된다. (기본값: `new`) */
  status?: AlarmItemStatus;
  ```

- 컴포넌트 JSDoc에는 **한 줄 요약 + 사용 시 주의사항**(너비를 부모가 정한다 등)을 적는다.
- Figma에서 온 값(variant 이름, 고정 폭, 이펙트)은 근거를 주석으로 남긴다. — ``Figma `(mobile) 알림`의 `Property 1` variant와 대응한다.``

## 9. 컴포넌트 선언

- `export default` 금지. **named export의 `function` 선언**을 쓴다. (`export function AlarmItem(...)`)
- `React.FC` / `memo` 기본 적용하지 않는다. 성능 문제가 실측된 뒤에 붙인다.
- 조건부 렌더링은 `&&`가 아니라 **삼항 + `null`**로 쓴다. (RN에서 falsy 값이 텍스트로 새는 것 방지)

  ```tsx
  {onDismiss ? <Pressable .../> : null}
  ```

## 10. 스토리 작성

`AlarmItem.stories.tsx`와 동일한 골격을 쓴다.

```tsx
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { AlarmItem } from "./AlarmItem";

const meta = {
  title: "Common/AlarmItem",
  component: AlarmItem,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    status: { control: "inline-radio", options: ["new", "read"] },
  },
  args: {/* Figma에 적힌 실제 문구를 그대로 */},
  decorators: [
    (Story) => (
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AlarmItem>;

export default meta;

type Story = StoryObj<typeof meta>;
```

- `title`은 `Common/<ComponentName>`. 폴더가 바뀌면 접두사도 바뀐다(`Icons/…`).
- `satisfies Meta<typeof X>` + `StoryObj<typeof meta>`로 타입을 잡는다. `as Meta` 캐스팅 금지.
- 유니온 prop은 `argTypes`에 `inline-radio` 컨트롤을 달아준다.
- 컴포넌트가 너비를 안 정하므로 **decorator에서 `w-[358px]`로 실제 화면 폭을 재현**한다.
- 스토리는 최소 이 4종을 덮는다: **기본 상태 / 각 variant / optional prop 생략 / 여러 개 나열(List)**.
- 각 story에 한 줄 JSDoc을 달면 autodocs에 설명으로 노출된다.
- 더미 텍스트는 Figma 문구를 그대로 쓴다(`'과제명'의 마감까지 NN시간 남았어요!`).

## 체크리스트

새 공용 컴포넌트를 만들 때:

- [ ] PascalCase 파일명 = export 컴포넌트명
- [ ] `<Component>Props` type, 마지막 prop이 `className`
- [ ] 자기 너비를 지정하지 않음
- [ ] 모든 클래스가 `cn()`을 통과, 순서는 base → 조건부 → `className`
- [ ] 색상/타이포 전부 토큰 클래스, hex·`dark:` 없음
- [ ] 아이콘은 `variant` + `className`
- [ ] 탭 요소에 role, 아이콘 버튼에 한국어 label + `hitSlop`
- [ ] 컴포넌트/prop에 한국어 JSDoc, Figma 근거 주석
- [ ] `.stories.tsx` 작성 (기본/variant/생략/List)
- [ ] `index.ts`에 값·타입 export 추가
