import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";

import { Modal } from "@/components/common/Modal/Modal";

import { ResourceEditModalContent } from "./ResourceEditModalContent";

const meta = {
  title: "Tasks/ResourceEditModalContent",
  component: ResourceEditModalContent,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    fileName: "",
    onChangeFileName: () => undefined,
    filePath: "",
    onChangeFilePath: () => undefined,
    onSave: () => undefined,
  },
  render: (args) => (
    <Modal title="자료 수정" headerIcon="cancel" onClose={() => undefined}>
      <ResourceEditModalContent {...args} />
    </Modal>
  ),
} satisfies Meta<typeof ResourceEditModalContent>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 비어 있는 상태. 플레이스홀더가 보인다. */
export const Default: Story = {};

/** `URL명`/`URL경로`로 문구를 바꾼 자료 수정. */
export const UrlVariant: Story = {
  args: {
    nameLabel: "URL명",
    namePlaceholder: "URL명을 입력하세요.",
    pathLabel: "URL경로",
    pathPlaceholder: "URL 경로를 입력하세요.",
  },
};

/** 값이 채워진 상태. */
export const Filled: Story = {
  args: { fileName: "발표 자료", filePath: "/documents/presentation.pdf" },
};

/** 입력해서 값을 바꿔 볼 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [fileName, setFileName] = useState(args.fileName);
    const [filePath, setFilePath] = useState(args.filePath);

    return (
      <Modal title="자료 수정" headerIcon="cancel" onClose={() => undefined}>
        <ResourceEditModalContent
          {...args}
          fileName={fileName}
          onChangeFileName={setFileName}
          filePath={filePath}
          onChangeFilePath={setFilePath}
        />
      </Modal>
    );
  },
};
