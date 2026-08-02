import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Chip } from "./Chip";

const meta = {
  title: "Common/Chip",
  component: Chip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "muted", "fill"],
    },
    color: {
      control: "inline-radio",
      options: ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05", "sub-null"],
    },
  },
  args: {
    label: "chip 1",
    color: "sub-01",
  },
} satisfies Meta<typeof Chip>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 홈 화면의 선택된 폴더 칩, 폴더 모달/과제 등록의 기본 상태. */
export const Default: Story = {};

/** 홈 화면의 선택되지 않은 폴더 칩, 폴더 모달에서 이미 쓰이고 있는 폴더 색. */
export const Muted: Story = {
  args: { variant: "muted" },
};

/** 폴더 모달·과제 등록에서 선택된 색상. */
export const Fill: Story = {
  args: { variant: "fill" },
};

/** `onPress`를 생략하면 탭할 수 없는 표시 전용 칩이 된다. */
export const NotPressable: Story = {
  args: { onPress: undefined },
};

export const AllColors: Story = {
  render: (args) => (
    <View className="gap-3">
      <View className="flex-row gap-2">
        <Chip {...args} color="sub-01" />
        <Chip {...args} color="sub-02" />
        <Chip {...args} color="sub-03" />
        <Chip {...args} color="sub-04" />
        <Chip {...args} color="sub-05" />
        <Chip {...args} color="sub-null" />
      </View>
      <View className="flex-row gap-2">
        <Chip {...args} variant="muted" color="sub-01" />
        <Chip {...args} variant="muted" color="sub-02" />
        <Chip {...args} variant="muted" color="sub-03" />
        <Chip {...args} variant="muted" color="sub-04" />
        <Chip {...args} variant="muted" color="sub-05" />
        <Chip {...args} variant="muted" color="sub-null" />
      </View>
      <View className="flex-row gap-2">
        <Chip {...args} variant="fill" color="sub-01" />
        <Chip {...args} variant="fill" color="sub-02" />
        <Chip {...args} variant="fill" color="sub-03" />
        <Chip {...args} variant="fill" color="sub-04" />
        <Chip {...args} variant="fill" color="sub-05" />
        <Chip {...args} variant="fill" color="sub-null" />
      </View>
    </View>
  ),
};
