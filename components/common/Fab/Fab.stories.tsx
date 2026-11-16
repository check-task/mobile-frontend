import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Fab } from "./Fab";

const meta = {
  title: "Common/Fab",
  component: Fab,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
    open: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View pointerEvents="none">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Fab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Open: Story = {
  args: { defaultOpen: true },
};

/** `open`을 넘기면 열림 상태를 호출부가 정한다(예: 홈 화면이 뒤 배경을 어둡게 깔 때). */
export const Controlled: Story = {
  args: { open: true },
};
