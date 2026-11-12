import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { Modal } from "@/components/common/Modal/Modal";

import { TeamMemberInfoModalContent } from "./TeamMemberInfoModalContent";

const meta = {
  title: "Tasks/TeamMemberInfoModalContent",
  component: TeamMemberInfoModalContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    nickname: "닉네임",
    phone: "010-0000-0000",
    email: "checktask@ct.kr",
  },
  render: (args) => (
    <Modal title="팀원정보" headerIcon="cancel" onClose={() => undefined}>
      <TeamMemberInfoModalContent {...args} />
    </Modal>
  ),
} satisfies Meta<typeof TeamMemberInfoModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Figma 예시 값. */
export const Default: Story = {};
