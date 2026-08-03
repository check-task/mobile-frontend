import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { View } from "react-native";

import { Input } from "./Input";

const meta = {
  title: "Common/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    // 모든 story가 자체 상태로 렌더링하므로(useState), 여기 값은 타입을 만족시키기 위한 자리표시자다.
    value: "",
    onChangeText: () => {},
    placeholder: "label",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

function BoxDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="box"
      value={value}
      onChangeText={setValue}
      placeholder="label"
    />
  );
}

function BoxPasswordDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="box-password"
      value={value}
      onChangeText={setValue}
      placeholder="label"
    />
  );
}

function BoxTimerDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="box-timer"
      value={value}
      onChangeText={setValue}
      placeholder="label"
      timerLabel="03:00"
    />
  );
}

function ModalDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="modal"
      value={value}
      onChangeText={setValue}
      placeholder="label"
    />
  );
}

function ModalPasswordDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="modal-password"
      value={value}
      onChangeText={setValue}
      placeholder="label"
    />
  );
}

function LineDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="line"
      value={value}
      onChangeText={setValue}
      placeholder="과제명을 입력하세요."
    />
  );
}

function CommentDemo() {
  const [value, setValue] = useState("");
  return (
    <Input
      shape="comment"
      value={value}
      onChangeText={setValue}
      placeholder="label"
      onSend={() => setValue("")}
    />
  );
}

/** 일반 박스형. 탭해서 포커스 테두리, 텍스트 입력 시 색 변화를 실제로 확인할 수 있다. */
export const Box: Story = {
  render: () => (
    <View className="w-[358px]">
      <BoxDemo />
    </View>
  ),
};

/** 비밀번호 표시/숨김 토글이 붙은 박스형. */
export const BoxPassword: Story = {
  render: () => (
    <View className="w-[358px]">
      <BoxPasswordDemo />
    </View>
  ),
};

/** 우측에 카운트다운 라벨(인증번호 재전송 등)이 붙은 박스형. */
export const BoxTimer: Story = {
  render: () => (
    <View className="w-[358px]">
      <BoxTimerDemo />
    </View>
  ),
};

/** 모달 안에서 쓰는 좁은 입력창. */
export const Modal: Story = {
  render: () => (
    <View className="w-[326px]">
      <ModalDemo />
    </View>
  ),
};

/** 모달 안에서 쓰는 비밀번호 입력창. */
export const ModalPassword: Story = {
  render: () => (
    <View className="w-[326px]">
      <ModalPasswordDemo />
    </View>
  ),
};

/** 밑줄만 있는 입력창 (폴더/과제명 등). */
export const Line: Story = {
  render: () => (
    <View className="w-[244px]">
      <LineDemo />
    </View>
  ),
};

/** 댓글 입력창. 값이 있어야 전송 버튼이 파란색으로 활성화된다. */
export const Comment: Story = {
  render: () => (
    <View className="w-[306px]">
      <CommentDemo />
    </View>
  ),
};

/** 모든 모양을 한 화면에 나열. */
export const All: Story = {
  render: () => (
    <View className="w-[358px] gap-4">
      <BoxDemo />
      <BoxPasswordDemo />
      <BoxTimerDemo />
      <View className="w-[326px]">
        <ModalDemo />
      </View>
      <View className="w-[326px]">
        <ModalPasswordDemo />
      </View>
      <View className="w-[244px]">
        <LineDemo />
      </View>
      <View className="w-[306px]">
        <CommentDemo />
      </View>
    </View>
  ),
};
