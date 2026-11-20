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
import {
  type DueDate,
  formatDueTime,
  formatShortDate,
  todayDueDate,
  toDueDateTime,
} from "@/lib/dueDate";

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
  /** 라벨 글자 크기. `sm`은 세부 TASK 행과 같은 12px (기본값: `md` 14px) */
  size?: "sm" | "md";
};

/** 달력 아이콘 + 날짜 라벨. 누르면 `DatePicker`를 화면 가운데 모달로 띄운다. */
export function DueDateField({
  value,
  onChange,
  allowNoDate = false,
  showTime = false,
  placeholder = "",
  maxDate,
  size = "md",
}: DueDateFieldProps) {
  const textClass = size === "sm" ? "text-b-04-r" : "text-b-02-r";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="마감일 선택"
        onPress={() => setIsOpen(true)}
        className="flex-row items-center gap-2"
      >
        <View className="flex-row items-center gap-1">
          <Calendar variant="lg" className="text-gray-600" />
          {value ? (
            <Text className={`text-gray-600 ${textClass}`}>
              {formatShortDate(value.date)}
            </Text>
          ) : (
            <Text className={`text-gray-400 ${textClass}`}>{placeholder}</Text>
          )}
        </View>
        {showTime && value?.hasTime ? (
          <>
            <View className="h-4 w-px bg-gray-600" />
            <Text className={`text-gray-600 ${textClass}`}>
              {formatDueTime(value.date)}
            </Text>
          </>
        ) : null}
      </Pressable>

      <DueDatePickerModal
        visible={isOpen}
        value={value}
        onClose={() => setIsOpen(false)}
        onChange={onChange}
        allowNoDate={allowNoDate}
        maxDate={maxDate}
      />
    </>
  );
}

export type DueDatePickerModalProps = {
  visible: boolean;
  /** 열 때 피커에 채워 둘 마감일. `null`이면 미지정. */
  value: DueDate | null;
  onClose: () => void;
  /** `저장`을 눌렀을 때. 저장하면 모달을 닫는다. */
  onChange: (value: DueDate | null) => void;
  /** 데이트피커에 `날짜 지정 안함`을 보여 줄지 */
  allowNoDate?: boolean;
  /** 이 마감일보다 늦게 고를 수 없다 (같은 날은 시간까지 비교) */
  maxDate?: DueDate | null;
};

/** 화면 가운데에 띄우는 `DatePicker` 모달. 마감일 라벨을 직접 그리는 곳(세부 TASK 행 등)에서도 쓴다. */
export function DueDatePickerModal({
  visible,
  value,
  onClose,
  onChange,
  allowNoDate = false,
  maxDate,
}: DueDatePickerModalProps) {
  const [draft, setDraft] = useState<DueDate>(todayDueDate);
  const [draftNoDate, setDraftNoDate] = useState(false);
  const [wasVisible, setWasVisible] = useState(false);

  // 열 때마다 현재 값으로 초안을 다시 채운다
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setDraft(value ?? todayDueDate());
      setDraftNoDate(allowNoDate && value === null);
    }
  }

  const save = () => {
    if (draftNoDate) {
      onChange(null);
    } else if (maxDate && draft.date > toDueDateTime(maxDate)) {
      // 상한보다 늦은 날짜이거나, 같은 날 더 늦은 시각이면 상한 시각으로 맞춘다.
      onChange({ ...draft, date: toDueDateTime(maxDate) });
    } else {
      onChange(draft);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
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
          onPress={onClose}
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
  );
}
