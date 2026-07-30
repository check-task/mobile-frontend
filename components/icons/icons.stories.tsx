import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import type { ReactElement } from "react";
import { Text, View } from "react-native";

import { AlarmDefault } from "./alarm-default";
import { Cancel } from "./cancel";
import { ICON_SIZES, type IconProps } from "./icon.types";
import * as Icons from "./index";

const ICON_ENTRIES = Object.entries(Icons).filter(
  ([name, value]) => typeof value === "function" && name !== "IconBase"
) as [string, (props: IconProps) => ReactElement][];

const meta = {
  title: "Icons",
  component: AlarmDefault,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: Object.keys(ICON_SIZES),
    },
    color: { control: "color" },
  },
  args: {
    variant: "md",
  },
} satisfies Meta<typeof AlarmDefault>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma `icon` 컴포넌트 세트의 아이콘 전체. */
export const All: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <View className="flex-row flex-wrap">
      {ICON_ENTRIES.map(([name, Icon]) => (
        <View key={name} className="w-24 items-center gap-1 py-3">
          <Icon {...args} />
          <Text className="text-gray-600 text-caption">{name}</Text>
        </View>
      ))}
    </View>
  ),
};

export const Alarm: Story = {};

export const CancelIcon: Story = {
  render: (args) => <Cancel {...args} />,
};

/** variant로 크기를 바꾼다. sm=16, md=20, lg=24 */
export const Variants: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <AlarmDefault variant="sm" />
      <AlarmDefault variant="md" />
      <AlarmDefault variant="lg" />
    </View>
  ),
};

/** 색상은 semantic token 클래스로 지정한다. */
export const Colors: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <AlarmDefault className="text-blue-500" />
      <AlarmDefault className="text-gray-600" />
      <Cancel className="text-gray-600" />
      <Cancel className="text-sub-01" />
    </View>
  ),
};
