import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { DropdownMenu } from "./DropdownMenu";

const Avatar = <View className="h-4 w-4 rounded-full bg-blue-100" />;

const MEMBER_ITEMS = [
  { key: "me", label: "멤버 닉네임(you)", leading: Avatar },
  { key: "member-1", label: "멤버 닉네임", leading: Avatar },
  { key: "member-2", label: "멤버 닉네임", leading: Avatar },
] as const;

const COMMENT_ITEMS = [
  { key: "edit", label: "댓글 수정" },
  { key: "delete", label: "댓글 삭제" },
] as const;

const meta = {
  title: "Common/DropdownMenu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    items: MEMBER_ITEMS,
    onSelect: () => {},
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

/** TASK 담당 설정. 프로필 이미지가 앞에 붙는다. */
export const Default: Story = {};

/** 댓글 수정/삭제. 문구만 있는 메뉴. */
export const TextOnly: Story = {
  args: { items: COMMENT_ITEMS, variant: "comment" },
};

/** 팀장 설정/팀원 삭제. */
export const TeamLeaderMenu: Story = {
  args: {
    variant: "leader",
    items: [
      { key: "leader", label: "팀장 설정" },
      { key: "remove", label: "팀원 삭제" },
    ],
  },
};

/** 항목이 하나뿐이면 구분선을 그리지 않는다. */
export const SingleItem: Story = {
  args: { items: [{ key: "edit", label: "댓글 수정" }], variant: "comment" },
};

/** 여러 메뉴를 나란히 비교한다. */
export const List: Story = {
  render: () => (
    <View className="flex-row gap-6">
      <DropdownMenu items={MEMBER_ITEMS} onSelect={() => {}} />
      <DropdownMenu
        items={COMMENT_ITEMS}
        onSelect={() => {}}
        variant="comment"
      />
      <DropdownMenu
        items={[
          { key: "leader", label: "팀장 설정" },
          { key: "remove", label: "팀원 삭제" },
        ]}
        onSelect={() => {}}
        variant="leader"
      />
    </View>
  ),
};
