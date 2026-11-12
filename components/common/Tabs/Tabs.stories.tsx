import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";
import { View } from "react-native";

import { Tabs } from "./Tabs";

const TAB_ITEMS = ["커뮤니케이션", "회의록", "자료"] as const;

const meta = {
  title: "Common/Tabs",
  component: Tabs,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    items: TAB_ITEMS,
    value: "커뮤니케이션",
    onChange: () => {},
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(358px = 좌우 16px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 첫 번째 탭이 선택된 기본 상태. */
export const Default: Story = {};

/** 두 번째 탭이 선택된 상태. */
export const SecondSelected: Story = {
  args: { value: "회의록" },
};

/** 세 번째 탭이 선택된 상태. */
export const ThirdSelected: Story = {
  args: { value: "자료" },
};

/** 눌러서 선택을 바꿔 볼 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return <Tabs {...args} value={value} onChange={setValue} />;
  },
};
