import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { FolderColorDot } from "./FolderColorDot";

const meta = {
  title: "Common/FolderColorDot",
  component: FolderColorDot,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "inline-radio",
      options: ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05", "sub-null"],
    },
    size: { control: "inline-radio", options: ["xs", "sm"] },
  },
  args: {
    color: "sub-01",
  },
} satisfies Meta<typeof FolderColorDot>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태(16px, `sm`). */
export const Default: Story = {};

/** 폴더 필터에서 쓰는 12px(`xs`). */
export const ExtraSmall: Story = {
  args: { size: "xs" },
};

/** `color`를 생략하면 `sub-null`(회색). */
export const WithoutColor: Story = {
  args: { color: undefined },
};

/** 폴더 색상 전체. */
export const Colors: Story = {
  render: () => (
    <View className="flex-row items-center gap-2">
      <FolderColorDot color="sub-01" />
      <FolderColorDot color="sub-02" />
      <FolderColorDot color="sub-03" />
      <FolderColorDot color="sub-04" />
      <FolderColorDot color="sub-05" />
      <FolderColorDot color="sub-null" />
    </View>
  ),
};
