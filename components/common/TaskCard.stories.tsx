import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { TaskCard, type TaskCardProps } from "./TaskCard";

const meta = {
  title: "Common/TaskCard",
  component: TaskCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["ing", "history"] },
    folderColor: {
      control: "inline-radio",
      options: ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05", "sub-null"],
    },
  },
  decorators: [
    (Story) => (
      // Figma 카드 폭(358px = 화면 좌우 20px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
  // props가 discriminated union이라 `Meta<typeof TaskCard>`는 args를 `never`로 좁힌다.
  // 유니온을 유지하기 위해 props 타입을 직접 넘기고, args도 스토리마다 명시한다.
} satisfies Meta<TaskCardProps>;

export default meta;

type Story = StoryObj<TaskCardProps>;

/** 진행 중 과제(`Property 1=ing`). 오른쪽에 D-day 배지가 붙는다. */
export const Ing: Story = {
  args: {
    type: "ing",
    folderName: "폴더명",
    folderColor: "sub-01",
    title: "과제명",
    dday: "D-3",
  },
};

/** 지난 과제(`Property 1=history`). 오른쪽에 날짜가 붙는다. */
export const History: Story = {
  args: {
    type: "history",
    folderName: "폴더명",
    folderColor: "sub-01",
    title: "과제명",
    date: "2026.07.31",
  },
};

/** `folderColor`를 생략하면 `sub-null`(회색) 점이 찍힌다. */
export const WithoutFolderColor: Story = {
  args: {
    type: "ing",
    folderName: "폴더명",
    title: "과제명",
    dday: "D-1",
  },
};

/** 과제명이 길면 두 줄 이상으로 늘어난다. */
export const LongTitle: Story = {
  args: {
    type: "ing",
    folderName: "아주 긴 폴더명이 들어가는 경우",
    folderColor: "sub-04",
    title: "아주 긴 과제명이 들어가면 카드 높이가 늘어난다",
    dday: "D-10",
  },
};

/** 목록으로 나열한 모습. */
export const List: Story = {
  args: { type: "ing", folderName: "폴더명", title: "과제명", dday: "D-3" },
  render: () => (
    <View className="gap-3">
      <TaskCard
        type="ing"
        folderName="폴더명"
        folderColor="sub-01"
        title="과제명"
        dday="D-3"
      />
      <TaskCard
        type="ing"
        folderName="폴더명"
        folderColor="sub-03"
        title="과제명"
        dday="D-12"
      />
      <TaskCard
        type="history"
        folderName="폴더명"
        folderColor="sub-02"
        title="과제명"
        date="2026.07.31"
      />
    </View>
  ),
};
