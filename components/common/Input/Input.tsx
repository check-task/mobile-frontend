import { type ComponentProps, useState } from "react";
import { Pressable, Text, TextInput, type TextStyle, View } from "react-native";

import { Eye, EyeClose, Send } from "@/components/icons";
import { INPUT_TEXT } from "@/constants/inputText";
import { cn } from "@/lib/utils";

/**
 * 입력창 모양. Figma `(mobile) input box`의 `Property 1` variant를 옮긴 것이다.
 * `default`/`focus`는 실제 `TextInput` 포커스 상태로 대체했으므로(별도 variant 없음),
 * 여기서는 레이아웃(테두리 모양·크기·너비 맥락)이 다른 축만 남긴다.
 *
 * - `box`: 일반 입력창 (예: 과제 등록 본문)
 * - `box-password`: `box` + 비밀번호 표시/숨김 토글
 * - `box-timer`: `box` + 우측 카운트다운 라벨 (예: 인증번호 재전송 `03:00`)
 * - `modal`: 모달 안에서 쓰는 좁은 입력창
 * - `modal-password`: `modal` + 비밀번호 표시/숨김 토글
 * - `line`: 밑줄만 있는 입력창 (예: 폴더/과제명)
 * - `comment`: 댓글 입력창 + 전송 버튼
 */
export type InputShape =
  | "box"
  | "box-password"
  | "box-timer"
  | "modal"
  | "modal-password"
  | "line"
  | "comment";

type PlainInputShape = Exclude<InputShape, "box-timer" | "comment">;

const CONTAINER_CLASS_BY_SHAPE: Record<InputShape, string> = {
  box: "rounded p-3",
  "box-password": "rounded p-3",
  "box-timer": "rounded p-3",
  modal: "rounded px-3 py-2 min-h-9",
  "modal-password": "rounded px-3 py-2 min-h-9",
  line: "px-2 pb-2 pt-1",
  comment: "h-[34px] rounded px-3 py-2",
};

/**
 * 한 줄 입력의 고정 높이(패딩 + 글자 줄높이). iOS `TextInput`은 placeholder일 때와
 * 글자가 있을 때 높이가 달라 입력하는 순간 레이아웃이 들썩이므로 높이를 고정한다.
 * 비밀번호 모양은 24px 아이콘이 높이를 정하므로 고정하지 않고, `multiline`이면 적용하지 않는다.
 */
const SINGLE_LINE_HEIGHT_CLASS_BY_SHAPE: Record<InputShape, string> = {
  box: "h-[45px]",
  "box-password": "",
  "box-timer": "h-[45px]",
  modal: "h-9",
  "modal-password": "",
  line: "h-[31.5px]",
  comment: "",
};

const BORDER_CLASS_BY_SHAPE: Record<InputShape, string> = {
  box: "border",
  "box-password": "border",
  "box-timer": "border",
  modal: "border",
  "modal-password": "border",
  line: "border-b",
  comment: "border",
};

// 입력값은 줄높이 없는 스타일을 쓴다(한글/영문 높이 차이 방지). INPUT_TEXT 참고.
const TEXT_STYLE_BY_SHAPE: Record<InputShape, TextStyle> = {
  box: INPUT_TEXT["b-02-r"],
  "box-password": INPUT_TEXT["b-02-r"],
  "box-timer": INPUT_TEXT["b-02-r"],
  modal: INPUT_TEXT["b-03-r"],
  "modal-password": INPUT_TEXT["b-03-r"],
  line: INPUT_TEXT["b-03-r"],
  comment: INPUT_TEXT["b-04-r"],
};

type RNTextInputProps = ComponentProps<typeof TextInput>;

type InputBase = Omit<
  RNTextInputProps,
  | "style"
  | "className"
  | "value"
  | "onChangeText"
  | "placeholder"
  | "onFocus"
  | "onBlur"
  | "secureTextEntry"
> & {
  /** 입력 값 */
  value: string;
  /** 값이 바뀔 때 */
  onChangeText: (text: string) => void;
  /** 플레이스홀더 문구 */
  placeholder: string;
  /** 바깥 여백 등 레이아웃 보정용. 너비는 부모가 결정한다. */
  className?: string;
};

/**
 * `box-timer`/`comment`는 우측에 고정 콘텐츠(카운트다운 라벨/전송 버튼)가 필요해
 * 추가 prop을 요구한다. 나머지 모양은 `shape`만으로 충분하다.
 */
export type InputProps = InputBase &
  (
    | { shape?: PlainInputShape; timerLabel?: never; onSend?: never }
    | {
        shape: "box-timer";
        /** 우측에 표시할 카운트다운 라벨 (예: 인증번호 재전송 `03:00`). 카운트다운 로직은 호출부가 관리한다. */
        timerLabel: string;
        onSend?: never;
      }
    | {
        shape: "comment";
        /** 전송 버튼을 눌렀을 때. `value`가 빈 문자열이면 버튼이 비활성화되어 호출되지 않는다. */
        onSend: () => void;
        timerLabel?: never;
      }
  );

/**
 * 테두리 있는 텍스트 입력창.
 * Figma `(mobile) input box`의 `default`/`focus`는 실제 포커스 상태로 구현했고,
 * 나머지 variant는 `shape`로 옮겼다. 너비는 지정하지 않으므로 부모가 결정한다.
 */
export function Input({
  value,
  onChangeText,
  placeholder,
  shape = "box",
  timerLabel,
  onSend,
  className,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(true);

  const hasPasswordToggle =
    shape === "box-password" || shape === "modal-password";
  const hasValue = value.length > 0;

  return (
    <View
      className={cn(
        "flex-row items-center",
        CONTAINER_CLASS_BY_SHAPE[shape],
        rest.multiline ? null : SINGLE_LINE_HEIGHT_CLASS_BY_SHAPE[shape],
        BORDER_CLASS_BY_SHAPE[shape],
        isFocused ? "border-gray-400" : "border-gray-200",
        className
      )}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={hasPasswordToggle ? isSecure : undefined}
        style={TEXT_STYLE_BY_SHAPE[shape]}
        className="flex-1 text-gray-600 placeholder:text-gray-400"
        {...rest}
      />

      {hasPasswordToggle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isSecure ? "비밀번호 표시" : "비밀번호 숨기기"}
          hitSlop={8}
          onPress={() => setIsSecure((prev) => !prev)}
        >
          {isSecure ? (
            <EyeClose
              variant="lg"
              className={isFocused ? "text-gray-600" : "text-gray-400"}
            />
          ) : (
            <Eye
              variant="lg"
              className={isFocused ? "text-gray-600" : "text-gray-400"}
            />
          )}
        </Pressable>
      ) : null}

      {shape === "box-timer" ? (
        <Text className="text-primary text-b-02-m">{timerLabel}</Text>
      ) : null}

      {shape === "comment" ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="전송"
          accessibilityState={{ disabled: !hasValue }}
          disabled={!hasValue}
          hitSlop={8}
          onPress={onSend}
        >
          <Send variant="md" disabled={!hasValue} />
        </Pressable>
      ) : null}
    </View>
  );
}
