import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";
import { View } from "react-native";

import { Toggle } from "./Toggle";

const meta = {
  title: "Common/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    value: false,
    onValueChange: () => {},
    accessibilityLabel: "시간 추가",
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 꺼짐 상태. */
export const Off: Story = {};

/** 켜짐 상태. */
export const On: Story = {
  args: { value: true },
};

/** 눌러서 켜고 끌 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);

    return <Toggle {...args} value={value} onValueChange={setValue} />;
  },
};

/** 꺼짐과 켜짐을 나란히 비교한다. */
export const List: Story = {
  render: () => (
    <View className="flex-row gap-4">
      <Toggle
        value={false}
        onValueChange={() => {}}
        accessibilityLabel="꺼짐"
      />
      <Toggle value onValueChange={() => {}} accessibilityLabel="켜짐" />
    </View>
  ),
};
