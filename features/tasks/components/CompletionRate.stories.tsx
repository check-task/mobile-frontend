import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { CompletionRate } from "./CompletionRate";

const meta = {
  title: "Tasks/CompletionRate",
  component: CompletionRate,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    percent: 82,
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(358px = 좌우 16px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof CompletionRate>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태(Figma 예시 82%). */
export const Default: Story = {};

/** 아직 완료된 세부 과제가 없는 상태. */
export const Empty: Story = {
  args: { percent: 0 },
};

/** 모두 완료된 상태. */
export const Full: Story = {
  args: { percent: 100 },
};

/** 값에 따라 채움 폭이 달라진다. */
export const List: Story = {
  render: () => (
    <View className="gap-4">
      <CompletionRate percent={0} />
      <CompletionRate percent={35} />
      <CompletionRate percent={82} />
      <CompletionRate percent={100} />
    </View>
  ),
};
