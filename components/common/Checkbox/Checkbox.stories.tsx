import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Common/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    checked: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 선택되지 않은 상태. */
export const Unchecked: Story = {};

/** 선택된 상태. */
export const Checked: Story = {
  args: { checked: true },
};

/** `onPress`를 생략하면 탭할 수 없는 표시 전용 체크박스가 된다. */
export const NotPressable: Story = {
  args: { checked: true, onPress: undefined },
};

function ToggleDemo() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onPress={() => setChecked((prev) => !prev)}
      accessibilityLabel="약관 동의"
    />
  );
}

/** 실제로 탭해서 켜고 끌 수 있는 상태. */
export const Interactive: Story = {
  render: () => <ToggleDemo />,
};

export const All: Story = {
  render: (args) => (
    <View className="flex-row gap-3">
      <Checkbox {...args} checked={false} />
      <Checkbox {...args} checked={true} />
    </View>
  ),
};
