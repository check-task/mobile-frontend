import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";
import { View } from "react-native";

import { SubTaskList } from "./SubTaskList";

const ITEMS = [
  {
    id: "1",
    title: "프로젝트 세팅",
    dueDate: "25.10.19",
    done: true,
    alarm: false,
  },
  {
    id: "2",
    title: "주제 정하기",
    dueDate: "25.10.22",
    done: true,
    alarm: true,
  },
  {
    id: "3",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
  {
    id: "4",
    title: "선행 연구 조사",
    dueDate: "25.10.22",
    done: false,
    alarm: true,
  },
] as const;

const meta = {
  title: "Tasks/SubTaskList",
  component: SubTaskList,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    items: ITEMS,
  },
  decorators: [
    (Story) => (
      <View className="w-[358px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SubTaskList>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 완료 2개와 진행 중 2개. 완료 행은 흐리게 표시되고 취소선이 그어진다. */
export const Default: Story = {};

/** 세부 TASK가 하나도 없는 상태. */
export const Empty: Story = {
  args: { items: [] },
};

/** 체크박스와 알림 아이콘을 직접 눌러 볼 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [items, setItems] = useState(args.items);

    const update = (id: string, key: "done" | "alarm") => {
      setItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, [key]: !item[key] } : item
        )
      );
    };

    return (
      <SubTaskList
        {...args}
        items={items}
        onToggle={(id) => update(id, "done")}
        onAlarmPress={(id) => update(id, "alarm")}
      />
    );
  },
};
