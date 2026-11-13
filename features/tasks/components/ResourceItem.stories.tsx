import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { ResourceItem } from "./ResourceItem";

const meta = {
  title: "Tasks/ResourceItem",
  component: ResourceItem,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    title: "자료명",
    link: "경로",
    onEdit: () => {},
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      // 실제 화면 폭(358px = 좌우 16px 여백)
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ResourceItem>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 수정/삭제 아이콘이 모두 있는 기본 상태. */
export const Default: Story = {};

/** 파일명을 보여 주는 경우. */
export const FileName: Story = {
  args: { link: "파일명" },
};

/** 핸들러를 넘기지 않으면 해당 아이콘을 그리지 않는다. */
export const WithoutActions: Story = {
  args: { onEdit: undefined, onDelete: undefined },
};

/** 제목이 길어도 아이콘과 겹치지 않고 한 줄로 잘린다. */
export const LongTitle: Story = {
  args: {
    title: "아주 긴 자료 이름이 들어가면 아이콘과 겹치지 않고 한 줄로 잘립니다",
  },
};

/** 여러 항목을 나열한다. */
export const List: Story = {
  render: () => (
    <View className="gap-3">
      <ResourceItem
        title="자료명"
        link="경로"
        onEdit={() => {}}
        onDelete={() => {}}
      />
      <ResourceItem
        title="자료명"
        link="파일명"
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </View>
  ),
};
