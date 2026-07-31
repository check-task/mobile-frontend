import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { BackHeader } from "./BackHeader";
import { CloseHeader } from "./CloseHeader";
import { LogoHeader } from "./LogoHeader";

const meta = {
  title: "Common/Header",
  component: BackHeader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <View className="w-[390px]">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BackHeader>;

export default meta;

export const BackHeaderStory: StoryObj<typeof BackHeader> = {
  name: "BackHeader",
  render: () => <BackHeader />,
};

export const BackHeaderWithLabel: StoryObj<typeof BackHeader> = {
  render: () => <BackHeader label="label" />,
};

export const LogoHeaderStory: StoryObj<typeof LogoHeader> = {
  name: "LogoHeader",
  render: () => <LogoHeader />,
};

export const CloseHeaderStory: StoryObj<typeof CloseHeader> = {
  name: "CloseHeader",
  render: () => <CloseHeader />,
};

export const All: StoryObj<typeof BackHeader> = {
  render: () => (
    <View className="gap-3">
      <BackHeader />
      <BackHeader label="label" />
      <LogoHeader />
      <CloseHeader />
    </View>
  ),
};
