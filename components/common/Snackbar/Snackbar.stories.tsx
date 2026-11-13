import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Snackbar } from "./Snackbar";

const meta = {
  title: "Common/Snackbar",
  component: Snackbar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    message: "TEST 1-1이 삭제되었습니다",
    onUndo: () => {},
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(358px = 좌우 16px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Snackbar>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 되돌리기 버튼이 있는 기본 상태. */
export const Default: Story = {};

/** `onUndo`를 넘기지 않으면 되돌리기 버튼을 그리지 않는다. */
export const WithoutUndo: Story = {
  args: { onUndo: undefined },
};

/** 메시지가 길면 버튼을 밀어내지 않고 여러 줄로 줄바꿈된다. */
export const LongMessage: Story = {
  args: {
    message: "선행 연구 조사 외 세부 과제 3개가 함께 삭제되었습니다",
  },
};

/** 여러 상태를 나열한다. */
export const List: Story = {
  render: () => (
    <View className="gap-2">
      <Snackbar message="TEST 1-1이 삭제되었습니다" onUndo={() => {}} />
      <Snackbar message="TEST 1-1이 삭제되었습니다" />
    </View>
  ),
};
