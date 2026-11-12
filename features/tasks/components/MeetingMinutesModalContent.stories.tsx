import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";

import { Modal } from "@/components/common/Modal/Modal";

import { MeetingMinutesModalContent } from "./MeetingMinutesModalContent";

const meta = {
  title: "Tasks/MeetingMinutesModalContent",
  component: MeetingMinutesModalContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    agenda: "",
    onChangeAgenda: () => undefined,
    result: "",
    onChangeResult: () => undefined,
    urlPath: "",
    onChangeUrlPath: () => undefined,
  },
  render: (args) => (
    <Modal title="MM.DD 회의록" headerIcon="check" onClose={() => undefined}>
      <MeetingMinutesModalContent {...args} />
    </Modal>
  ),
} satisfies Meta<typeof MeetingMinutesModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 비어 있는 상태. 입력칸 최소 높이는 56px이다. */
export const Default: Story = {};

/** 여러 줄을 입력해 볼 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [agenda, setAgenda] = useState(args.agenda);
    const [result, setResult] = useState(args.result);
    const [urlPath, setUrlPath] = useState(args.urlPath);

    return (
      <Modal title="MM.DD 회의록" headerIcon="check" onClose={() => undefined}>
        <MeetingMinutesModalContent
          {...args}
          agenda={agenda}
          onChangeAgenda={setAgenda}
          result={result}
          onChangeResult={setResult}
          urlPath={urlPath}
          onChangeUrlPath={setUrlPath}
        />
      </Modal>
    );
  },
};
