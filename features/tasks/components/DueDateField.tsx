import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { DatePicker } from "@/components/common/DatePicker/DatePicker";
import { Calendar } from "@/components/icons";

export type DueDate = {
  date: Date;
  /** `시간 추가`를 켰는지. 끄면 날짜만 의미가 있다. */
  hasTime: boolean;
};

// 시간 추가를 켰을 때 Figma 처럼 오전 00:00 부터 시작하도록 자정으로 맞춘다.
function today(): DueDate {
  const now = new Date();
  return {
    date: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    hasTime: false,
  };
}

/** 실제 마감 시각. 시간을 지정하지 않았으면 그날 23:59 로 본다. */
export function toDueDateTime({ date, hasTime }: DueDate) {
  const result = new Date(date);
  if (!hasTime) result.setHours(23, 59, 0, 0);
  return result;
}

function formatDate(date: Date) {
  const yy = String(date.getFullYear() % 100).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}`;
}

function formatTime(date: Date) {
  const hours = date.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const minute = String(date.getMinutes()).padStart(2, "0");
  // 피커 시간 칩과 같은 00~11 표기 (자정 = 오전 00:00)
  const hour = String(hours % 12).padStart(2, "0");
  return `${period} ${hour}:${minute}`;
}

export type DueDateFieldProps = {
  /** 선택된 마감일. `null`이면 미지정. */
  value: DueDate | null;
  /** 데이트피커에서 `저장`을 눌렀을 때 */
  onChange: (value: DueDate | null) => void;
  /** 데이트피커에 `날짜 지정 안함`을 보여 줄지 */
  allowNoDate?: boolean;
  /** `시간 추가`가 켜져 있으면 날짜 옆에 시간을 보여 줄지 */
  showTime?: boolean;
  /** 값이 없을 때 보여 줄 문구 */
  placeholder?: string;
  /** 이 마감일보다 늦게 고를 수 없다 (같은 날은 시간까지 비교) */
  maxDate?: DueDate | null;
};

/** 달력 아이콘 + 날짜 라벨. 누르면 `DatePicker`를 화면 가운데 모달로 띄운다. */
export function DueDateField({
  value,
  onChange,
  allowNoDate = false,
  showTime = false,
  placeholder = "",
  maxDate,
}: DueDateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<DueDate>(today);
  const [draftNoDate, setDraftNoDate] = useState(false);

  const open = () => {
    setDraft(value ?? today());
    setDraftNoDate(allowNoDate && value === null);
    setIsOpen(true);
  };

  const save = () => {
    if (draftNoDate) {
      onChange(null);
    } else if (maxDate && draft.date > toDueDateTime(maxDate)) {
      // 상한보다 늦은 날짜이거나, 같은 날 더 늦은 시각이면 상한 시각으로 맞춘다.
      onChange({ ...draft, date: toDueDateTime(maxDate) });
    } else {
      onChange(draft);
    }
    setIsOpen(false);
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="마감일 선택"
        onPress={open}
        className="flex-row items-center gap-2"
      >
        <View className="flex-row items-center gap-1">
          <Calendar variant="lg" className="text-gray-600" />
          {value ? (
            <Text className="text-gray-600 text-b-02-r">
              {formatDate(value.date)}
            </Text>
          ) : (
            <Text className="text-gray-400 text-b-02-r">{placeholder}</Text>
          )}
        </View>
        {showTime && value?.hasTime ? (
          <>
            <View className="h-4 w-px bg-gray-600" />
            <Text className="text-gray-600 text-b-02-r">
              {formatTime(value.date)}
            </Text>
          </>
        ) : null}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        {/* 시/분을 입력할 때 키보드가 피커를 가리지 않도록 올린다. */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 items-center justify-center bg-gray-900/40"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="닫기"
            className="absolute inset-0"
            onPress={() => setIsOpen(false)}
          />
          <DatePicker
            value={draft.date}
            onChange={(date) => {
              setDraft({ ...draft, date });
              // 날짜를 고르면 `날짜 지정 안함`을 해제해야 저장 시 null 로 덮이지 않는다.
              setDraftNoDate(false);
            }}
            timeEnabled={draft.hasTime}
            onTimeEnabledChange={(hasTime) => setDraft({ ...draft, hasTime })}
            maxDate={maxDate?.date}
            noDate={draftNoDate}
            onNoDateChange={allowNoDate ? setDraftNoDate : undefined}
            onSave={save}
            // DatePicker 기본값 self-start 를 덮어 가운데 정렬
            className="self-center"
          />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
