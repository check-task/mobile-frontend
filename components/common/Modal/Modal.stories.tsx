import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { Text, View } from "react-native";

import { Button } from "@/components/common/Button/Button";

import { Modal } from "./Modal";

const meta = {
  title: "Common/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    title: "자료 삭제",
    onClose: () => undefined,
    children: (
      <View className="py-6">
        <Text className="text-gray-800 text-b-02-m">
          자료를 삭제하시겠습니까?
        </Text>
      </View>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 제목과 짧은 본문만 있는 기본 모달. */
export const Default: Story = {
  render: (args) => (
    <Modal {...args}>
      <View className="py-6">
        <Text className="text-gray-800 text-b-02-m">
          자료를 삭제하시겠습니까?
        </Text>
      </View>
    </Modal>
  ),
};

/** 닫기 아이콘과 children으로 조합한 버튼 영역을 함께 쓰는 확인 모달. */
export const ConfirmContent: Story = {
  args: {
    headerIcon: "cancel",
  },
  render: (args) => (
    <Modal {...args}>
      <View className="py-6">
        <View className="gap-2">
          <Text className="text-gray-800 text-b-02-m">
            자료를 삭제하시겠습니까?
          </Text>
          <Text className="text-gray-600 text-b-04-r">
            삭제된 자료는 영구 삭제되며, 복구할 수 없습니다.
          </Text>
        </View>

        <View className="mt-8 gap-3">
          <Button label="삭제" size="modal" />
          <Button label="취소" size="modal" variant="gray" />
        </View>
      </View>
    </Modal>
  ),
};

/** 개인정보 처리방침처럼 긴 본문이 들어가는 모달. */
export const LongContent: Story = {
  args: {
    title: "개인정보 처리방침",
    headerIcon: "check",
  },
  render: (args) => (
    <Modal {...args}>
      <View className="gap-4 py-6">
        {Array.from({ length: 12 }, (_, index) => (
          <View key={index} className="gap-1">
            <Text className="text-gray-800 text-calendar">
              제{index + 1}조 (개인정보 처리방침)
            </Text>
            <Text className="text-gray-600 text-calendar-2">
              본 서비스는 개인정보를 안전하게 처리하며, 관련 법령에 따라
              이용자의 권리를 보호합니다. 서비스 이용 과정에서 필요한 최소한의
              정보만 수집하고 목적 달성 후 지체 없이 파기합니다.
            </Text>
          </View>
        ))}
      </View>
    </Modal>
  ),
};
