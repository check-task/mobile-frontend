import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { Modal } from "@/components/common/Modal/Modal";

import { DeleteConfirmModalContent } from "./DeleteConfirmModalContent";

const meta = {
  title: "Tasks/DeleteConfirmModalContent",
  component: DeleteConfirmModalContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    heading: "모든 세부과제를 삭제하시겠습니까?",
    description: "삭제된 과제는 영구 삭제되며, 복구할 수 없습니다.",
    onConfirm: () => undefined,
    onCancel: () => undefined,
  },
  render: (args) => (
    <Modal title="TASK 삭제" onClose={args.onCancel}>
      <DeleteConfirmModalContent {...args} />
    </Modal>
  ),
} satisfies Meta<typeof DeleteConfirmModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 세부과제 전체 삭제 확인. */
export const Default: Story = {};

/** 대상 이름이 파랗게 강조되고 `취소`가 위에 놓이는 자료 삭제. */
export const TargetName: Story = {
  render: (args) => (
    <Modal title="자료 삭제" onClose={args.onCancel}>
      <DeleteConfirmModalContent
        targetName="자료명"
        description="삭제된 자료는 영구 삭제되며, 복구할 수 없습니다."
        cancelFirst
        onConfirm={args.onConfirm}
        onCancel={args.onCancel}
      />
    </Modal>
  ),
};

/** 확인 버튼 문구를 바꾼 경우. */
export const CustomConfirmLabel: Story = {
  args: {
    heading: "이 팀원을 삭제하시겠습니까?",
    description: "삭제된 팀원은 다시 초대해야 합니다.",
    confirmLabel: "팀원 삭제",
  },
};
