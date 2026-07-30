import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import {
  FolderFilterItem,
  type FolderFilterItemProps,
} from "./FolderFilterItem";

const meta = {
  title: "Common/FolderFilterItem",
  component: FolderFilterItem,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["folder", "all"] },
    color: {
      control: "inline-radio",
      options: ["sub-01", "sub-02", "sub-03", "sub-04", "sub-05", "sub-null"],
    },
  },
  decorators: [
    (Story) => (
      // Figma 폴더 필터 드롭다운 폭(106px)
      <View className="w-[106px]">
        <Story />
      </View>
    ),
  ],
  // props가 discriminated union이라 `Meta<typeof FolderFilterItem>`은 args를 `never`로 좁힌다.
  // 유니온을 유지하기 위해 props 타입을 직접 넘기고, args도 스토리마다 명시한다.
} satisfies Meta<FolderFilterItemProps>;

export default meta;

type Story = StoryObj<FolderFilterItemProps>;

/** 기본 상태(`Property 1=default`). */
export const Default: Story = {
  args: { type: "folder", name: "폴더 1", color: "sub-01" },
};

/** 선택된 폴더(`Property 1=selected`). */
export const Selected: Story = {
  args: { type: "folder", name: "폴더 1", color: "sub-01", selected: true },
};

/** `color`를 생략하면 `sub-null`(회색) 점이 찍힌다. */
export const WithoutColor: Story = {
  args: { type: "folder", name: "폴더 1" },
};

/** 모든 과제(`Property 1=모든과제`). 아래 구분선이 붙는다. */
export const AllTasks: Story = {
  args: { type: "all" },
};

/** 모든 과제 선택(`Property 1=모든과제 선택`). */
export const AllTasksSelected: Story = {
  args: { type: "all", selected: true },
};

/** 실제 사용처처럼 모든 과제 + 폴더 목록을 나열한 모습. */
export const List: Story = {
  args: { type: "all", selected: true },
  render: () => (
    <View className="rounded-lg bg-gray-0">
      <FolderFilterItem type="all" selected />
      <FolderFilterItem type="folder" name="폴더 1" color="sub-01" />
      <FolderFilterItem type="folder" name="폴더 2" color="sub-02" />
      <FolderFilterItem type="folder" name="폴더 3" color="sub-03" />
      <FolderFilterItem type="folder" name="이름이 아주 긴 폴더 이름" />
    </View>
  ),
};
