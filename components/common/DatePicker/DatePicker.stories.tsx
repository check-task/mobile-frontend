import type { Meta, StoryObj } from "@storybook/react-native-web-vite";
import { useState } from "react";

import { DatePicker } from "./DatePicker";

const meta = {
  title: "Common/DatePicker",
  component: DatePicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    value: new Date(2026, 5, 19),
    onChange: () => {},
    timeEnabled: false,
    onTimeEnabledChange: () => {},
    onSave: () => {},
  },
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

/** 기본 상태. 선택한 날짜가 있는 달이 열린다. */
export const Default: Story = {};

/** `시간 추가` 토글이 켜진 상태. 선택한 날짜와 `오전 00 : 00` 시간 칩이 나온다. */
export const TimeEnabled: Story = {
  args: { timeEnabled: true },
};

/** 오후 시간이 있는 값. */
export const AfternoonTime: Story = {
  args: { value: new Date(2026, 5, 19, 15, 30), timeEnabled: true },
};

/** `onNoDateChange`를 넘기면 `날짜 지정 안함` 줄이 그려진다. */
export const WithNoDateOption: Story = {
  args: { onNoDateChange: () => {}, timeEnabled: true },
};

/** `날짜 지정 안함`이 선택된 상태. */
export const NoDateSelected: Story = {
  args: { onNoDateChange: () => {}, noDate: true },
};

/** `minDate`보다 이전 날짜는 흐리게 표시되고 선택할 수 없다. */
export const WithMinDate: Story = {
  args: { minDate: new Date(2026, 5, 15) },
};

/** 날짜 선택, 월 이동, 토글, `날짜 지정 안함`을 직접 눌러 볼 수 있다. */
export const Interactive: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    const [timeEnabled, setTimeEnabled] = useState(args.timeEnabled);
    const [noDate, setNoDate] = useState(false);

    return (
      <DatePicker
        {...args}
        value={value}
        onChange={setValue}
        timeEnabled={timeEnabled}
        onTimeEnabledChange={setTimeEnabled}
        noDate={noDate}
        onNoDateChange={setNoDate}
      />
    );
  },
};
