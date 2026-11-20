import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button } from "@/components/common/Button/Button";
import { Toggle } from "@/components/common/Toggle/Toggle";
import { CheckCircle, Left, Right } from "@/components/icons";
import { INPUT_TEXT } from "@/constants/inputText";
import { CARD_SHADOW } from "@/constants/shadows";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"] as const;
const DAYS_PER_WEEK = WEEKDAYS.length;
const WEEK_ROWS = 6;

type DayState = "default" | "outside" | "selected" | "disabled";

const DAY_CIRCLE_CLASS: Record<DayState, string> = {
  default: "",
  outside: "",
  selected: "bg-primary",
  disabled: "",
};

const DAY_TEXT_CLASS: Record<DayState, string> = {
  default: "text-gray-900",
  outside: "text-gray-600 opacity-[0.38]",
  selected: "text-bg font-medium",
  disabled: "text-gray-400 opacity-[0.38]",
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatTime(date: Date) {
  const hours = date.getHours();

  return {
    period: hours < 12 ? "오전" : "오후",
    hour: String(hours % 12).padStart(2, "0"),
    minute: String(date.getMinutes()).padStart(2, "0"),
  };
}

type TimeDigitsProps = {
  /** 표시할 두 자리 값 (예: `09`) */
  value: string;
  /** 스크린 리더용 이름 (예: `시`) */
  label: string;
  /** 숫자를 입력할 때마다 호출된다. 범위 보정은 호출부가 한다. */
  onChange: (value: number) => void;
};

/** 시간 칩 안의 시/분 두 자리 입력. 입력 중에는 친 그대로 보여 주고, 포커스가 빠지면 `value`로 돌아간다. */
function TimeDigits({ value, label, onChange }: TimeDigitsProps) {
  // null 이면 입력 중이 아님. 포커스되면 비워서 새로 치게 하고, 현재 값은 placeholder 로 흐리게 보여 준다.
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <TextInput
      value={draft ?? value}
      placeholder={value}
      onChangeText={(text) => {
        const digits = text.replace(/\D/g, "").slice(0, 2);
        setDraft(digits);
        if (digits.length > 0) {
          onChange(Number(digits));
        }
      }}
      onFocus={() => setDraft("")}
      onBlur={() => setDraft(null)}
      keyboardType="number-pad"
      maxLength={2}
      // 칸이 작아 커서·선택 핸들이 숫자를 가리므로 숨긴다.
      caretHidden
      contextMenuHidden
      accessibilityLabel={label}
      style={INPUT_TEXT.caption}
      className="w-4 p-0 text-center text-gray-600 placeholder:text-gray-400"
    />
  );
}

function buildMonthWeeks(viewMonth: Date) {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const leadingDays = new Date(year, month, 1).getDay();

  return Array.from({ length: WEEK_ROWS }, (_, row) =>
    Array.from(
      { length: DAYS_PER_WEEK },
      (_, column) =>
        new Date(year, month, 1 - leadingDays + row * DAYS_PER_WEEK + column)
    )
  );
}

export type DatePickerProps = {
  /** 선택된 날짜 */
  value: Date;
  /** 날짜를 눌렀을 때 */
  onChange: (date: Date) => void;
  /** `시간 추가` 토글 상태 */
  timeEnabled: boolean;
  /** `시간 추가` 토글을 눌렀을 때 */
  onTimeEnabledChange: (enabled: boolean) => void;
  /** `저장`을 눌렀을 때 */
  onSave: () => void;
  /** 이 날짜보다 이전 날짜는 선택할 수 없다. 넘기지 않으면 제한이 없다. */
  minDate?: Date;
  /** 이 날짜보다 이후 날짜는 선택할 수 없다. 넘기지 않으면 제한이 없다. */
  maxDate?: Date;
  /** `날짜 지정 안함` 선택 여부 */
  noDate?: boolean;
  /** `날짜 지정 안함`을 눌렀을 때. 넘기지 않으면 이 줄을 그리지 않는다. */
  onNoDateChange?: (noDate: boolean) => void;
  /** 바깥 여백·위치 보정용. 너비는 달력 격자(224px)에 맞춰진다. */
  className?: string;
};

/**
 * Figma `(mobile) date picker`를 옮긴 달력. 월 이동, 날짜 선택, `시간 추가` 토글, `저장`으로 구성된다.
 * 보이는 달은 내부 상태이고, 이전/다음 달에 걸친 날짜를 누르면 그 달로 넘어간다.
 */
export function DatePicker({
  value,
  onChange,
  timeEnabled,
  onTimeEnabledChange,
  onSave,
  minDate,
  maxDate,
  noDate = false,
  onNoDateChange,
  className,
}: DatePickerProps) {
  const [viewMonth, setViewMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1)
  );
  // 부모가 value의 연/월을 바꿨을 때만 표시 월을 맞춘다. value가 그대로면 이전/다음 달 탐색 상태를 유지한다.
  const valueMonthKey = value.getFullYear() * 12 + value.getMonth();
  const [syncedMonthKey, setSyncedMonthKey] = useState(valueMonthKey);

  if (syncedMonthKey !== valueMonthKey) {
    setSyncedMonthKey(valueMonthKey);
    setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1));
  }

  const weeks = buildMonthWeeks(viewMonth);
  const minDay = minDate ? startOfDay(minDate) : null;
  const maxDay = maxDate ? startOfDay(maxDate) : null;
  const time = formatTime(value);
  const isPm = value.getHours() >= 12;

  const setTime = (hours: number, minutes: number) => {
    const next = new Date(value);
    next.setHours(hours, minutes);
    onChange(next);
  };

  const moveMonth = (offset: number) => {
    setViewMonth(
      new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1)
    );
  };

  const selectDay = (day: Date) => {
    setViewMonth(new Date(day.getFullYear(), day.getMonth(), 1));

    if (!timeEnabled) {
      onChange(day);
      return;
    }

    // 날짜 칸은 자정 기준이라, 시간 추가가 켜져 있으면 기존 시각을 선택한 날짜에 옮긴다.
    const next = new Date(day);
    next.setHours(
      value.getHours(),
      value.getMinutes(),
      value.getSeconds(),
      value.getMilliseconds()
    );
    onChange(next);
  };

  return (
    <View
      style={CARD_SHADOW}
      className={cn(
        "items-end gap-4 self-start rounded-lg bg-gray-0 p-4",
        className
      )}
    >
      <View className="gap-3">
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-b-04-m">
              {`${viewMonth.getFullYear()}년 ${viewMonth.getMonth() + 1}월`}
            </Text>
            <View className="flex-row gap-1">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="이전 달"
                onPress={() => moveMonth(-1)}
                hitSlop={8}
              >
                <Left className="text-gray-900" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="다음 달"
                onPress={() => moveMonth(1)}
                hitSlop={8}
              >
                <Right className="text-gray-900" />
              </Pressable>
            </View>
          </View>

          <View className="relative rounded-lg py-1">
            {/* 피그마 테두리는 프레임 안쪽이라 레이아웃 크기에 넣지 않고 겹쳐 그린다. */}
            <View
              pointerEvents="none"
              className="absolute inset-0 rounded-lg border border-gray-100"
            />
            <View className="flex-row border-b border-gray-100 pb-[3px]">
              {WEEKDAYS.map((weekday, index) => (
                <View
                  key={`${weekday}-${index}`}
                  className="h-8 w-8 items-center justify-center"
                >
                  <Text className="text-gray-900 text-caption">{weekday}</Text>
                </View>
              ))}
            </View>

            <View className="gap-0.5">
              {weeks.map((week) => (
                <View key={week[0].getTime()} className="flex-row">
                  {week.map((day) => {
                    const state: DayState =
                      (minDay && day < minDay) || (maxDay && day > maxDay)
                        ? "disabled"
                        : // `날짜 지정 안함`이면 선택 표시를 끈다
                          !noDate && isSameDay(day, value)
                          ? "selected"
                          : day.getMonth() !== viewMonth.getMonth()
                            ? "outside"
                            : "default";

                    return (
                      <Pressable
                        key={day.getTime()}
                        accessibilityRole="button"
                        accessibilityLabel={`${day.getFullYear()}년 ${day.getMonth() + 1}월 ${day.getDate()}일`}
                        accessibilityState={{
                          selected: state === "selected",
                          disabled: state === "disabled",
                        }}
                        disabled={state === "disabled"}
                        onPress={() => selectDay(day)}
                        className="h-8 w-8 items-center justify-center"
                      >
                        <View
                          className={cn(
                            "h-7 w-7 items-center justify-center rounded-full",
                            DAY_CIRCLE_CLASS[state]
                          )}
                        >
                          <Text
                            className={cn(
                              "text-caption",
                              DAY_TEXT_CLASS[state]
                            )}
                          >
                            {day.getDate()}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </View>

        {onNoDateChange ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: noDate }}
            onPress={() => onNoDateChange(!noDate)}
            className="flex-row items-center justify-between"
          >
            <Text className="text-gray-900 text-b-04-r">날짜 지정 안함</Text>
            <CheckCircle
              className={noDate ? "text-gray-900" : "text-gray-300"}
            />
          </Pressable>
        ) : null}

        <View className="gap-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-900 text-b-04-r">시간 추가</Text>
            <Toggle
              value={timeEnabled}
              onValueChange={onTimeEnabledChange}
              accessibilityLabel="시간 추가"
            />
          </View>

          {timeEnabled ? (
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600 text-caption">
                {`${value.getFullYear()}년 ${value.getMonth() + 1}월 ${value.getDate()}일`}
              </Text>
              <View className="flex-row items-center gap-1 rounded-[2px] border border-gray-600 px-1 py-0.5">
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="오전/오후 전환"
                  hitSlop={4}
                  onPress={() =>
                    setTime((value.getHours() + 12) % 24, value.getMinutes())
                  }
                >
                  <Text style={INPUT_TEXT.caption} className="text-gray-600">
                    {time.period}
                  </Text>
                </Pressable>
                <View className="flex-row items-center gap-0.5">
                  <TimeDigits
                    value={time.hour}
                    label="시"
                    // 00~11 로 표기하므로 12 는 00 으로 받는다.
                    // 13 이상은 24시간제로 보고 오후로 바꾼다 (오전 13:00 → 오후 01:00).
                    onChange={(hour) =>
                      setTime(
                        hour >= 13
                          ? Math.min(hour, 23)
                          : (hour === 12 ? 0 : hour) + (isPm ? 12 : 0),
                        value.getMinutes()
                      )
                    }
                  />
                  <Text style={INPUT_TEXT.caption} className="text-gray-600">
                    :
                  </Text>
                  <TimeDigits
                    value={time.minute}
                    label="분"
                    onChange={(minute) =>
                      setTime(value.getHours(), Math.min(minute, 59))
                    }
                  />
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <Button label="저장" size="sm" onPress={onSave} />
    </View>
  );
}
