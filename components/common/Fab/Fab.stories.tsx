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
