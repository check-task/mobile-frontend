import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Toast } from "./Toast";

const meta = {
  title: "Common/Toast",
  component: Toast,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["success", "fail"] },
  },
  args: {
    type: "success",
    message: "토스트 메세지",
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(358px = 좌우 20px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 성공 토스트. */
export const Success: Story = {};

/** 실패 토스트. */
export const Fail: Story = {
  args: { type: "fail" },
};

/** 긴 메시지(Figma `예외처리`). 내용에 맞춰 알약 너비가 늘어난다. */
export const LongMessage: Story = {
  args: { type: "fail", message: "마감일 이전 날짜로 설정할 수 없습니다." },
};

/** 종류가 바뀌어도 아이콘 슬롯이 20px로 고정돼 메시지 위치가 흔들리지 않는다. */
export const List: Story = {
  render: () => (
    <View className="gap-2">
      <Toast type="success" message="토스트 메세지" />
      <Toast type="fail" message="토스트 메세지" />
      <Toast type="fail" message="마감일 이전 날짜로 설정할 수 없습니다." />
    </View>
  ),
};
