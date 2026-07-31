import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Folder } from "@/components/icons";

import { IconButton } from "./IconButton";

const meta = {
  title: "Common/IconButton",
  component: IconButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    label: "label",
  },
  decorators: [
    (Story) => (
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: "TASK 추가" },
};

export const FolderIcon: Story = {
  args: {
    label: "label",
    icon: <Folder variant="sm" className="text-gray-600" />,
  },
};
