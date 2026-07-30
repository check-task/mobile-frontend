import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { AlarmItem } from "./alarm-item";

const meta = {
  title: "Common/AlarmItem",
  component: AlarmItem,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["new", "read"],
    },
  },
  args: {
    title: "‘과제명’의 마감까지 NN시간 남았어요!",
    description: "현재 NN% 완성 중이에요. 빨리 끝내고 쉬어요!",
    status: "new",
    onDismiss: () => {},
  },
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

/** 읽지 않은 알림. */
export const New: Story = {};

/** 읽은 알림 — 전체가 흐리게 표시된다. */
export const Read: Story = {
  args: { status: "read" },
};

/** `onDismiss`를 넘기지 않으면 닫기 버튼이 없다. */
export const WithoutDismiss: Story = {
  args: { onDismiss: undefined },
};

/** 목록에 여러 개 쌓인 모습. */
export const List: Story = {
  render: (args) => (
    <View className="gap-3">
      <AlarmItem {...args} />
      <AlarmItem {...args} status="read" />
    </View>
  ),
};
