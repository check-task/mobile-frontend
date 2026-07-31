import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Button } from "./Button";

const meta = {
  title: "Common/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["blue", "gray", "outline", "white"],
    },
    size: {
      control: "inline-radio",
      options: ["tiny", "sm", "modal", "lg", "xl"],
    },
  },
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
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Blue: Story = {};

export const Gray: Story = {
  args: { variant: "gray" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const White: Story = {
  args: { variant: "white", size: "xl" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const All: Story = {
  render: (args) => (
    <View className="gap-3">
      <Button {...args} size="tiny" variant="outline" className="self-start" />
      <View className="flex-row gap-3">
        <Button {...args} size="sm" />
        <Button {...args} size="sm" variant="outline" />
        <Button {...args} size="sm" variant="gray" />
      </View>
      <Button {...args} size="modal" />
      <Button {...args} size="modal" variant="gray" />
      <Button {...args} size="lg" />
      <Button {...args} size="lg" variant="gray" />
      <Button {...args} size="xl" />
      <Button {...args} size="xl" variant="white" />
    </View>
  ),
};
