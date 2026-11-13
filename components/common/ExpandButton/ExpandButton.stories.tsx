import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { ExpandButton } from "./ExpandButton";

const meta = {
  title: "Common/ExpandButton",
  component: ExpandButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    onPress: () => {},
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(334px = 카드 안쪽 여백을 뺀 폭)
      <View className="w-[334px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ExpandButton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태. */
export const Default: Story = {};

/** `onPress`를 넘기지 않으면 탭할 수 없는 표시 전용 버튼이 된다. */
export const WithoutHandler: Story = {
  args: { onPress: undefined },
};
