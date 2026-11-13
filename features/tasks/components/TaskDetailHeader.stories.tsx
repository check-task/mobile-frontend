import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { TaskDetailHeader } from "./TaskDetailHeader";

const meta = {
  title: "Tasks/TaskDetailHeader",
  component: TaskDetailHeader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    folderColor: {
      control: "inline-radio",
      options: ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05", "sub-null"],
    },
  },
  args: {
    folderColor: "sub-01",
    dday: "D-3",
    title: "과제명",
    percent: 82,
    onEditPress: () => {},
  },
  decorators: [
    (Story) => (
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TaskDetailHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태(Figma 예시 82%). */
export const Default: Story = {};

/** 폴더 색이 바뀌어도 D-day 색은 그대로다. */
export const OtherFolderColor: Story = {
  args: { folderColor: "sub-03" },
};

/** 과제명이 길면 한 줄로 잘리고 `과제수정` 버튼은 밀리지 않는다. */
export const LongTitle: Story = {
  args: {
    title: "아주 긴 과제 이름이 들어가면 버튼을 밀어내지 않고 한 줄로 잘립니다",
  },
};

/** `onEditPress`를 넘기지 않아도 버튼은 그려진다. */
export const WithoutHandler: Story = {
  args: { onEditPress: undefined },
};
