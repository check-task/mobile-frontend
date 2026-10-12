---
name: write-story
description: 공용 컴포넌트의 Storybook 스토리(*.stories.tsx)를 작성하거나 수정할 때 사용.
---

# 스토리 작성

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
