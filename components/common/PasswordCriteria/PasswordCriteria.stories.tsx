import type { Meta, StoryObj } from "@storybook/react-native-web-vite";

import { PasswordCriteria } from "./PasswordCriteria";

const meta = {
  title: "Common/PasswordCriteria",
  component: PasswordCriteria,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: { password: "" },
} satisfies Meta<typeof PasswordCriteria>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 입력 전. 두 조건 모두 회색. */
export const Empty: Story = {};

/** 길이만 충족. 길이는 파랑 ✓, 특수문자는 빨강 ✕. */
export const LengthOnly: Story = {
  args: { password: "qddfv1234" },
};

/** 특수문자만 충족. 길이는 빨강 ✕, 특수문자는 파랑 ✓. */
export const SpecialOnly: Story = {
  args: { password: "a@" },
};

/** 모두 충족. */
export const AllMet: Story = {
  args: { password: "qddfv123@" },
};
